import admin from 'firebase-admin';

var serviceAccount = require('../../../serviceAccountKey.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin Initialized.');
} catch (error: any) {
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack);
    }
}

export default admin;
