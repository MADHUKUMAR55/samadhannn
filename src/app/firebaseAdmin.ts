import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminDb: Firestore | null = null;

const initializeFirebaseAdmin = () => {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    let serviceAccount: Record<string, unknown>;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch {
      throw new Error('Invalid service account JSON format');
    }

    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Service account missing required fields');
    }

    const app = !getApps().length
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApp();

    return getFirestore(app);
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    return null;
  }
};

adminDb = initializeFirebaseAdmin();

export const getFirebaseAdmin = () => {
  if (!adminDb) {
    adminDb = initializeFirebaseAdmin();
  }
  return adminDb;
};
