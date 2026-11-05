import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

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

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firestoreDatabaseId);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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

let firestoreConnected = false;

export async function checkFirestoreConnectionStatus(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    firestoreConnected = true;
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      firestoreConnected = false;
      return false;
    }
    // Even if doc doesn't exist, reaching server without offline error means connected
    firestoreConnected = true;
    return true;
  }
}

export function isFirestoreConnected(): boolean {
  return firestoreConnected;
}

checkFirestoreConnectionStatus();

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
          email: (user.email || 'user@enganda.org').slice(0, 254),
          displayName: (user.displayName || 'ENGANDA User').slice(0, 120),
          role: 'member',
          organization: 'ENGANDA Network',
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

export async function syncEnquiryToFirestore(enquiry: {
  id: string;
  reference: string;
  groupId: string;
  groupName: string;
  supportType: string;
  contactName: string;
  email: string;
  phone: string;
  organisation: string;
  packageName: string;
  message: string;
}) {
  if (!auth.currentUser) return;
  const cleanId = enquiry.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `inquiries/${cleanId}`;
  try {
    await setDoc(doc(db, 'inquiries', cleanId), {
      id: cleanId,
      userId: auth.currentUser.uid,
      organizationName: String(
        enquiry.organisation || enquiry.groupName || 'ENGANDA Supporter'
      ).slice(0, 160),
      contactPerson: String(enquiry.contactName || 'Supporter').slice(0, 120),
      email: String(enquiry.email || 'contact@enganda.org').slice(0, 254),
      phone: String(enquiry.phone || '').slice(0, 30),
      partnershipType: `${enquiry.supportType} - ${enquiry.packageName}`.slice(0, 120),
      message: `[Ref: ${enquiry.reference} | Group: ${enquiry.groupName}] ${enquiry.message}`.slice(
        0,
        2000
      ),
      status: 'NEW',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveNewsletterSubscriptionToFirestore(subscription: {
  id: string;
  reference: string;
  email: string;
  name?: string;
  organisation?: string;
  consent: boolean;
}) {
  const cleanId = subscription.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64);
  const path = `newsletter_subscriptions/${cleanId}`;
  try {
    await setDoc(doc(db, 'newsletter_subscriptions', cleanId), {
      id: cleanId,
      reference: String(subscription.reference || 'NEWS-00001').slice(0, 32),
      email: String(subscription.email || '').trim().toLowerCase().slice(0, 254),
      subscriberName: String(subscription.name || 'ENGANDA Partner').trim().slice(0, 120),
      organisation: String(subscription.organisation || 'Independent').trim().slice(0, 160),
      consent: Boolean(subscription.consent),
      frequency: 'QUARTERLY',
      targetGoalYouth: 2000000,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Only throw structured error if signed in or if rules reject; log gracefully so backend storage remains primary
    console.warn('Firestore newsletter sync warning:', error);
  }
}
