# Enganda — Youth Economic Transformation Platform

**Enganda** is a full-stack bilingual (English & Luganda) social enterprise platform designed to transition 2,000,000 informal sector youth in Uganda into formalized, bankable, and structured cooperative economic units.

---

## 1. Architecture Overview
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite.
- **Backend**: Node.js 22 + Express (`server.ts`) serving REST API endpoints (`/api/*`), Gemini AI Youth & Enterprise Advisor (`@google/genai`), and static production assets (`dist/`).
- **Database & Auth**: Google Cloud Firestore (`firebase/firestore`) + Firebase Authentication (`firebase/auth` with Google Sign-In).

---

## 2. Required Environment Variables
Copy `.env.example` to `.env` for local development or configure the following variables in Google Cloud Run:

| Variable | Description |
| :--- | :--- |
| `API_KEY` | Google Gemini API key used by `new GoogleGenAI({ apiKey: process.env.API_KEY })` in `server.ts`. |
| `GEMINI_API_KEY` | Fallback alias for the Gemini API key. |
| `PORT` | HTTP server port (defaults to `3000` locally; Cloud Run automatically injects `8080`). |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key (falls back to `firebase-applet-config.json`). |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (`<project-id>.firebaseapp.com`). |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase project ID (`gen-lang-client-0760457427`). |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket (`<project-id>.firebasestorage.app`). |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID. |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID. |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | Named Firestore database ID (`ai-studio-engandayouthecon-1b136350-2eca-4c1e-b985-fe82f2e08b28`). |

---

## 3. Enabling Firestore & Authentication in Firebase Console
1. Open the [Firebase Console](https://console.firebase.google.com/project/gen-lang-client-0760457427).
2. Navigate to **Authentication > Sign-in method** and ensure **Google** is enabled.
3. Under **Authentication > Settings > Authorized domains**, add your Cloud Run service domain (`*.run.app`) and any custom production domain.
4. Navigate to **Firestore Database** and verify the database `ai-studio-engandayouthecon-1b136350-2eca-4c1e-b985-fe82f2e08b28` is active.

---

## 4. Deployment Commands

### Deploy Firestore Security Rules & Composite Indexes
```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project gen-lang-client-0760457427
```

### Build & Deploy to Google Cloud Run
```bash
gcloud run deploy enganda-platform \
  --source . \
  --project gen-lang-client-0760457427 \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,API_KEY=YOUR_GEMINI_API_KEY"
```
