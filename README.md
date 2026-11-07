# Instappfood

An Expo / React Native recipe-sharing app using Firebase Authentication, Firestore, Storage, and Redux.

## Running the app

This repository uses the legacy **Expo SDK 42**, React 16, and Firebase 8 APIs. It has not been migrated to a current Expo SDK. The `expo` executable in SDK 42 delegates to a separately installed `expo-cli`; the repository does not include that CLI. Current Expo Go is not a compatible runtime for this SDK. Use a matching development environment/client or migrate the SDK before attempting a modern production build.

The repository also contains tracked `node_modules` and local Expo state from the original project. Those files are not a reliable reproducible installation. Dependency cleanup, a fresh lockfile installation, and an Expo upgrade need separate validation; do not assume the checked-in dependencies are production-ready.

Firebase is initialized in `App.js`. To use your own backend, replace its client configuration and enable email/password authentication, Firestore, and Storage. Firebase client configuration is public by design; authorization must be enforced by deployed Firebase rules. No Firestore or Storage rules are supplied in this repository, and the backend rules have not been audited.

Expected document paths:

- `users/{uid}`: name, bio, email
- `posts/{uid}/userPosts/{postId}`: title, products, instruction, downloadURL, creation
- `posts/{uid}/userPosts/{postId}/comments/{commentId}`: creator, text, creation
- `posts/{uid}/userPosts/{postId}/likes/{likerUid}`
- `following/{uid}/userFollowing/{followedUid}`

## Checks

With Node 18 or later and the JavaScript dependencies available:

```sh
npm test
npm run check
```

The regression tests exercise Redux updates and mocked Firebase subscription lifecycles. The source check compiles every application module and checks unresolved identifiers, imports, and assets. These checks do not replace a native build or live Firebase integration testing.

## Interaction fixes

- Tap a profile photo to open its recipe. Long-press your own photo to confirm deletion.
- Creating or deleting a recipe refreshes your profile through a Firestore subscription.
- Following and unfollowing updates the feed without duplicate posts or retained subscriptions.
- Comments refresh live and clear the input after successful submission.
- Saving requires a photo, title, ingredients, and method, and reports upload failures.
- User search matches a name prefix, is limited to 30 results, and ignores stale responses.

Deleting a recipe currently deletes its Firestore post document only. Existing Storage images and Firestore subcollections require a trusted backend cleanup process; this repository does not provide one.
