import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

const hasRequiredConfig = requiredKeys.every((key) => Boolean(firebaseConfig[key]));

if (!hasRequiredConfig) {
  console.warn(
    "Firebase config is missing required environment variables. Check frontend/.env."
  );
}

const app = hasRequiredConfig ? initializeApp(firebaseConfig) : null;

let analytics;
if (app && typeof window !== "undefined" && firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

const auth = app ? getAuth(app) : null;

export { app, analytics, auth };
