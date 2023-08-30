import { cert, getApp, getApps, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

const credentials: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

function createFirebaseAdminApp() {
    if (getApps().length === 0) {
        return admin.initializeApp({
            credential: cert(credentials),
        });
    } else {
        return getApp();
    }
}

const app = createFirebaseAdminApp();
export const adminAuth = getAuth(app);
