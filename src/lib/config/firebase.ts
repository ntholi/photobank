import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDqaCfK9YAr0WfybINmviY0Vx-hULoLUxk',
    authDomain: 'photobanktests.firebaseapp.com',
    projectId: 'photobanktests',
    storageBucket: 'photobanktests.appspot.com',
    messagingSenderId: '581279966610',
    appId: '1:581279966610:web:2b0d8452cc77bb637c4d4b',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);

// if (true) {
//     console.log('Connecting to the Firebase Emulators...');
//     connectStorageEmulator(storage, '127.0.0.1', 9199);
// }
