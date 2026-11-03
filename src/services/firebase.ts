import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

/**
 * Firebase configuration resolved from environment variables (VITE_FIREBASE_*)
 * with fallback to the provisioned firebase-applet-config.json.
 * Never hardcodes credentials in source code.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};

const firestoreDatabaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId;

// Initialize Firebase App once (Singleton pattern)
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firestoreDatabaseId);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Structured Firestore Error Handler (Mandatory per Firebase Integration Specification)
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'global'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication Helpers
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (user) {
    const userPath = `users/${user.uid}`;
    try {
      const existingSnap = await getDoc(doc(db, 'users', user.uid));
      if (!existingSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: (user.email || 'user@enganda.ug').slice(0, 254),
          displayName: (user.displayName || 'Enganda Member').slice(0, 120),
          role: 'donor',
          organization: 'Enganda Community',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, userPath);
    }
  }
  return user;
}

export async function logOutUser() {
  await signOut(auth);
}

// Firestore Persistence Helpers (Defensive Payload Sanitization matching firebase-blueprint.json)
export async function saveGroupToFirestore(groupData: {
  id: string;
  name: string;
  division: string;
  location: string;
  memberCount: number;
  womenPercentage: number;
  trade: string;
  stage: 'Formalized & Banked' | 'In Incubation' | 'Skilling Phase';
  bankAccount: string;
  treesPlanted: number;
  leaderName: string;
  leaderPhone: string;
}) {
  if (!auth.currentUser) return;
  const cleanId = groupData.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `groups/${cleanId}`;
  try {
    await setDoc(doc(db, 'groups', cleanId), {
      id: cleanId,
      name: String(groupData.name || 'Youth Group').slice(0, 140),
      division: String(groupData.division || 'Entebbe Division A').slice(0, 80),
      location: String(groupData.location || 'Entebbe').slice(0, 140),
      memberCount: Math.max(1, Math.min(5000, Number(groupData.memberCount) || 25)),
      womenPercentage: Math.max(0, Math.min(100, Number(groupData.womenPercentage) || 40)),
      trade: String(groupData.trade || 'Vocational Artisan').slice(0, 120),
      stage: groupData.stage || 'In Incubation',
      bankAccount: String(groupData.bankAccount || 'EcoBank Pending').slice(0, 100),
      treesPlanted: Math.max(0, Math.min(1000000, Number(groupData.treesPlanted) || 0)),
      leaderName: String(groupData.leaderName || 'Group Leader').slice(0, 120),
      leaderPhone: String(groupData.leaderPhone || '+256772109231').slice(0, 30),
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteGroupFromFirestore(groupId: string) {
  if (!auth.currentUser) return;
  const cleanId = groupId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `groups/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'groups', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveTransactionToFirestore(tx: {
  id: string;
  reference: string;
  relworxBatchId: string;
  amount: number;
  currency?: 'UGX' | 'USD';
  provider: 'MTN' | 'AIRTEL';
  phoneNumber: string;
  donorName: string;
  purpose: string;
  treesSponsored: number;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
}) {
  if (!auth.currentUser) return;
  const cleanId = tx.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `transactions/${cleanId}`;
  try {
    await setDoc(doc(db, 'transactions', cleanId), {
      id: cleanId,
      userId: auth.currentUser.uid,
      reference: String(tx.reference || 'RWX-UG-2026').slice(0, 64),
      relworxBatchId: String(tx.relworxBatchId || 'REL-BCH').slice(0, 64),
      amount: Math.max(500, Math.min(5000000000, Number(tx.amount) || 10000)),
      currency: tx.currency === 'USD' ? 'USD' : 'UGX',
      provider: tx.provider === 'AIRTEL' ? 'AIRTEL' : 'MTN',
      phoneNumber: String(tx.phoneNumber || '+256772109231').slice(0, 30),
      donorName: String(tx.donorName || 'Enganda Contributor').slice(0, 120),
      purpose: String(tx.purpose || 'Youth Support').slice(0, 200),
      treesSponsored: Math.max(0, Math.min(1000000, Number(tx.treesSponsored) || 0)),
      status: tx.status || 'SUCCESSFUL',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function savePartnerInquiryToFirestore(inquiry: {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
}) {
  if (!auth.currentUser) return;
  const cleanId = inquiry.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `inquiries/${cleanId}`;
  try {
    await setDoc(doc(db, 'inquiries', cleanId), {
      id: cleanId,
      userId: auth.currentUser.uid,
      organizationName: String(inquiry.organizationName || 'Partner Org').slice(0, 160),
      contactPerson: String(inquiry.contactPerson || 'Representative').slice(0, 120),
      email: String(inquiry.email || 'partner@org.int').slice(0, 254),
      phone: String(inquiry.phone || '').slice(0, 30),
      partnershipType: String(inquiry.partnershipType || 'Strategic').slice(0, 120),
      message: String(inquiry.message || '').slice(0, 2000),
      status: 'NEW',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveInvestmentToFirestore(inv: {
  id: string;
  investmentRef: string;
  investorName: string;
  email: string;
  phone: string;
  investorType: string;
  targetGroup: string;
  commitmentAmount: number;
  currency: 'UGX' | 'USD';
}) {
  if (!auth.currentUser) return;
  const cleanId = inv.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `investments/${cleanId}`;
  try {
    await setDoc(doc(db, 'investments', cleanId), {
      id: cleanId,
      userId: auth.currentUser.uid,
      investmentRef: String(inv.investmentRef || 'INV-UG-2026').slice(0, 64),
      investorName: String(inv.investorName || 'Impact Investor').slice(0, 140),
      email: String(inv.email || 'investor@fund.com').slice(0, 254),
      phone: String(inv.phone || '').slice(0, 30),
      investorType: String(inv.investorType || 'Direct Fund').slice(0, 120),
      targetGroup: String(inv.targetGroup || 'All 21 Groups').slice(0, 160),
      commitmentAmount: Math.max(100, Math.min(100000000000, Number(inv.commitmentAmount) || 1000)),
      currency: inv.currency === 'USD' ? 'USD' : 'UGX',
      status: 'PLEDGED',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveSiteSettingsToFirestore(settings: {
  intakeOpen: boolean;
  intakeBatchName: string;
  bannerNoticeEn: string;
  bannerNoticeLg: string;
  nationalTargetYouth: number;
  contactHotline: string;
  relworxGatewayActive: boolean;
}) {
  if (!auth.currentUser) return;
  const path = 'settings/global';
  try {
    await setDoc(doc(db, 'settings', 'global'), {
      intakeOpen: Boolean(settings.intakeOpen),
      intakeBatchName: String(settings.intakeBatchName).slice(0, 160),
      bannerNoticeEn: String(settings.bannerNoticeEn).slice(0, 500),
      bannerNoticeLg: String(settings.bannerNoticeLg).slice(0, 500),
      nationalTargetYouth: Math.max(1000, Math.min(50000000, Number(settings.nationalTargetYouth) || 2000000)),
      contactHotline: String(settings.contactHotline).slice(0, 40),
      relworxGatewayActive: Boolean(settings.relworxGatewayActive),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserTransactionsFromFirestore() {
  if (!auth.currentUser) return [];
  const path = 'transactions';
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateUserRoleInFirestore(role: 'donor' | 'partner' | 'member') {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}`;
  try {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      role,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
