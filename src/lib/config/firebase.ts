import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCzEJxGVTeuvk_4Md6e37J5rwFajMXOz90',
    authDomain: 'lesotho-photobank.firebaseapp.com',
    projectId: 'lesotho-photobank',
    storageBucket: 'lesotho-photobank.appspot.com',
    messagingSenderId: '1096617899126',
    appId: '1:1096617899126:web:21c49194bf21019fd0db57',
    measurementId: 'G-CZPH71CHKC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const storage = getStorage();

// const analytics = getAnalytics(app);

// if (true) {
//     console.log('Connecting to the Firebase Emulators...');
//     connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// }
