# Enganda Platform — Firestore Security Specification (Phase 0 TDD)

## 1. Core Data Invariants
1. **Default-Deny Safety Net**: Any path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **PII Isolation (`/users/{userId}`)**: User profiles contain PII (`email`, `displayName`). Reads (`get`, `list`) and writes (`create`, `update`) are strictly restricted to the document owner (`request.auth.uid == userId`) or a verified administrator (`isAdmin()`). Self-assigning administrative privileges is prohibited (`role in ['donor', 'partner', 'member']`).
3. **Admin Verification (`/admins/{adminId}`)**: Admin status is strictly derived from either a verified email matching the bootstrapped admin (`mugisolo@gmail.com` with `request.auth.token.email_verified == true`) or the existence of `/databases/$(database)/documents/admins/$(request.auth.uid)`.
4. **Youth Group Integrity (`/groups/{groupId}`)**: Anyone can read the public directory of pilot groups, but only verified authenticated users (`isVerified()`) can register a new group where `createdBy == request.auth.uid` and `createdAt == request.time`. Only the creator or an admin can update a group, and `createdBy`/`createdAt` are immutable. Only admins can delete a group.
5. **Per-User Financial & Dossier Scoping (`/transactions/{transactionId}`, `/inquiries/{inquiryId}`, `/investments/{investmentId}`)**:
   - Reads (`get` and `list`) are strictly scoped via `resource.data.userId == request.auth.uid || isAdmin()`. Blanket `isSignedIn()` reads are forbidden.
   - Creates require `isVerified()`, `incoming().userId == request.auth.uid`, and `incoming().createdAt == request.time`.
   - Terminal State Locking: Once a transaction reaches `status == 'SUCCESSFUL'`, non-admins cannot mutate it.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection**: Creating `/users/{uid}` with an undeclared field `{"isAdmin": true}` -> Rejected by `hasOnly()`.
2. **Identity Spoofing on Create**: Creating `/transactions/tx-1` with `userId: "victim-uid"` while authenticated as `"attacker-uid"` -> Rejected by `incoming().userId == request.auth.uid`.
3. **Unverified Admin Email Spoof**: Accessing `/admins/uid` with `email: "mugisolo@gmail.com"` but `email_verified: false` -> Rejected by `isVerified()`.
4. **PII Horizontal Privilege Escalation**: Authenticated user `"user-A"` calling `get` or `list` on `/users/user-B` -> Rejected by `isOwner(userId) || isAdmin()`.
5. **Blanket Query Scraping on Transactions**: Authenticated user executing an unconstrained `list` query on `/transactions` -> Rejected by `resource.data.userId == request.auth.uid || isAdmin()`.
6. **Denial-of-Wallet String Bomb**: Creating a group with a 50KB `name` string -> Rejected by `data.name.size() <= 140`.
7. **ID Poisoning Attack**: Creating a document with special characters or >128 chars in `{groupId}` -> Rejected by `isValidId(groupId)`.
8. **Update-Gap Type Poisoning**: Updating an allowed key (`memberCount`) on `/groups/{groupId}` with a string `"1000"` instead of a number -> Rejected because `isValidYouthGroup(incoming())` wraps the entire `allow update` block.
9. **Immortal Field Mutation**: Updating `createdAt` or `createdBy` on `/groups/{groupId}` -> Rejected by `incoming().createdAt == existing().createdAt && incoming().createdBy == existing().createdBy`.
10. **Forged Client Timestamp**: Creating a transaction with a past or future `createdAt` timestamp -> Rejected by `incoming().createdAt == request.time`.
11. **Terminal State Reversal**: Attempting to update a `SUCCESSFUL` transaction as a regular user -> Rejected.
12. **Unauthorized Site Settings Mutation**: Regular user attempting to update `/settings/global` -> Rejected by `isAdmin()`.
