// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCyC4E4efcJYYxKEbBNzPYjtURAu4TUDgI",
    authDomain: "german-hoeren.firebaseapp.com",
    projectId: "german-hoeren",
    storageBucket: "german-hoeren.firebasestorage.app",
    messagingSenderId: "1040744989762",
    appId: "1:1040744989762:web:3d4bde954be2ee093d99db",
    measurementId: "G-RSWGZCR2J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export default app;
