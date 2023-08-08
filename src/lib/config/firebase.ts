// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
