/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const dirtyDozenTests: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on UserProfile',
    collection: '/users/user_123',
    operation: 'create',
    auth: { uid: 'user_123', email: 'youth@enganda.ug', email_verified: true },
    payload: {
      uid: 'user_123',
      email: 'youth@enganda.ug',
      displayName: 'Grace Nalubega',
      role: 'member',
      isAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Transaction Create',
    collection: '/transactions/TXN_999',
    operation: 'create',
    auth: { uid: 'attacker_uid', email: 'attacker@example.com', email_verified: true },
    payload: {
      id: 'TXN_999',
      userId: 'victim_uid',
      reference: 'RWX-UG-2026-1111',
      relworxBatchId: 'REL-BCH-1111',
      amount: 50000,
      currency: 'UGX',
      provider: 'MTN',
      phoneNumber: '+256772109231',
      donorName: 'Spoofed Donor',
      purpose: 'Tree Sponsorship',
      treesSponsored: 5,
      status: 'SUCCESSFUL',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Admin Email Spoof',
    collection: '/settings/global',
    operation: 'update',
    auth: { uid: 'spoof_admin', email: 'mugisolo@gmail.com', email_verified: false },
    payload: { intakeOpen: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'PII Horizontal Privilege Escalation on /users',
    collection: '/users/victim_uid',
    operation: 'get',
    auth: { uid: 'other_user', email: 'other@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Blanket Query Scraping on /transactions',
    collection: '/transactions',
    operation: 'list',
    auth: { uid: 'scraper_uid', email: 'scraper@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-Wallet String Bomb on YouthGroup',
    collection: '/groups/ENG-ENT-099',
    operation: 'create',
    auth: { uid: 'user_123', email: 'youth@enganda.ug', email_verified: true },
    payload: {
      id: 'ENG-ENT-099',
      name: 'A'.repeat(500),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'ID Poisoning Attack with Invalid Characters',
    collection: '/groups/INVALID$ID#WITH@SPACES',
    operation: 'create',
    auth: { uid: 'user_123', email: 'youth@enganda.ug', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Update-Gap Type Poisoning on YouthGroup',
    collection: '/groups/ENG-ENT-001',
    operation: 'update',
    auth: { uid: 'user_123', email: 'youth@enganda.ug', email_verified: true },
    payload: {
      memberCount: 'NOT_A_NUMBER',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Immortal Field Mutation (createdBy / createdAt)',
    collection: '/groups/ENG-ENT-001',
    operation: 'update',
    auth: { uid: 'user_123', email: 'youth@enganda.ug', email_verified: true },
    payload: {
      createdBy: 'different_owner_uid',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Forged Client Timestamp on Inquiry Create',
    collection: '/inquiries/PRT-UG-1001',
    operation: 'create',
    auth: { uid: 'user_123', email: 'partner@org.int', email_verified: true },
    payload: {
      createdAt: '1999-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Terminal State Reversal on Transaction',
    collection: '/transactions/TXN_901',
    operation: 'update',
    auth: { uid: 'user_123', email: 'donor@example.com', email_verified: true },
    payload: {
      status: 'PENDING',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized Site Settings Mutation by Non-Admin',
    collection: '/settings/global',
    operation: 'update',
    auth: { uid: 'user_123', email: 'user@example.com', email_verified: true },
    payload: {
      nationalTargetYouth: 10,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
