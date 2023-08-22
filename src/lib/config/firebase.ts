import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyD6B4RErZ1B66Ff5Iz4uZakdXft1KfERzQ',
    authDomain: 'nationalphotobank.firebaseapp.com',
    projectId: 'nationalphotobank',
    storageBucket: 'nationalphotobank.appspot.com',
    messagingSenderId: '820366036958',
    appId: '1:820366036958:web:f00ee1876e29ba1aed974f',
    measurementId: 'G-0B5DBK34MF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const googleProvider = new GoogleAuthProvider();
// export const auth = getAuth(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);

// if (true) {
//     console.log('Connecting to the Firebase Emulators...');
//     connectStorageEmulator(storage, '127.0.0.1', 9199);
// }
