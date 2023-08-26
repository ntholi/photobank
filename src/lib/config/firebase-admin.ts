import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

var serviceAccount = require('../../../serviceAccountKey.json');

try {
    if (getApps().length <= 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase admin initialized');
    }
} catch (error: any) {
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack);
    }
}

export default admin;
