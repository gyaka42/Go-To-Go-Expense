# Go-To-Go Expense Enhancements

## Biometric Lock

- Install the biometric dependency with `expo install expo-local-authentication` (do **not** add it manually to `package.json`).
- iOS builds require the following entry in `app.json` (already present):
  ```json
  "ios": {
    "infoPlist": {
      "NSFaceIDUsageDescription": "We gebruiken Face ID/Touch ID om jouw gegevens te beveiligen."
    }
  }
  ```
- The app now prompts for Face ID/Touch ID on launch (when enabled in settings) and before opening private wallets.

## Auto-Categorisation Rules

- The rules engine lives in `src/rules/rulesEngine.ts` with defaults in `src/rules/defaultRules.ts`.
- Use `useRules()` from `src/rules/useRules.ts` to read and persist user-defined rules (stored in AsyncStorage).
- `applyRules({ description, merchant })` returns the suggested `categoryId` based on the first matching enabled rule.
- Default examples cover AH/Albert Heijn and NS/GVB keywords; extend `DEFAULT_RULES` for more cases.

## Shared Wallets

- Shared wallet helpers are available in `src/sharedWallets/`:
  - `firestore.ts` exposes helpers such as `inviteMember`, `addTransaction`, `approveTransaction`, `rejectTransaction`, and snapshot listeners.
  - `useSharedWallet.ts` aggregates wallet, transaction, and activity streams with actions and role helpers.
- Shared wallet transactions live under `wallets/{walletId}/transactions` and activity under `wallets/{walletId}/activity`.
- Firestore security rules template:

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      function isOwner(wallet) {
        return request.auth != null && wallet.data.ownerIds.hasAny([request.auth.uid]);
      }
      function isMember(wallet) {
        return request.auth != null && (
          wallet.data.ownerIds.hasAny([request.auth.uid]) ||
          wallet.data.memberIds.hasAny([request.auth.uid])
        );
      }

      match /wallets/{walletId} {
        allow read: if isMember(resource);
        allow create: if request.auth != null;
        allow update, delete: if isOwner(resource);

        match /transactions/{txnId} {
          allow read: if isMember(get(/databases/$(database)/documents/wallets/$(walletId)));
          allow create: if isMember(get(/databases/$(database)/documents/wallets/$(walletId)));
          allow update, delete: if isOwner(get(/databases/$(database)/documents/wallets/$(walletId)));
        }

        match /activity/{activityId} {
          allow read: if isMember(get(/databases/$(database)/documents/wallets/$(walletId)));
          allow create: if isOwner(get(/databases/$(database)/documents/wallets/$(walletId)));
        }
      }
    }
  }
  ```

- When inviting members, ensure the target account exists in the `users` collection (lookup by email).
- Non-owners create pending transactions; owners can approve/reject them from the wallet detail screen.
