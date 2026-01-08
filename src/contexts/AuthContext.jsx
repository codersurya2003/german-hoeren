import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create or update user document in Firestore
    async function createUserDocument(user) {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // New user - create document
            await setDoc(userRef, {
                profile: {
                    displayName: user.displayName || 'German Learner',
                    email: user.email,
                    photoURL: user.photoURL || null,
                    createdAt: serverTimestamp()
                },
                progress: {
                    xp: 0,
                    streak: 0,
                    lastPractice: null,
                    level: 1
                },
                achievements: [],
                stats: {
                    wordsLearned: 0,
                    examsTaken: 0,
                    pronunciationSessions: 0,
                    speakingSessions: 0,
                    challengesCompleted: 0
                }
            });
        }
    }

    // Sign in with Google
    async function signInWithGoogle() {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserDocument(result.user);
            return result.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // Sign in with email/password
    async function signInWithEmail(email, password) {
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // Create account with email/password
    async function createAccount(email, password, displayName) {
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            await updateProfile(result.user, { displayName });

            // Create Firestore document
            await createUserDocument({
                ...result.user,
                displayName
            });

            return result.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // Reset password
    async function resetPassword(email) {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // Sign out
    async function logout() {
        setError(null);
        try {
            await signOut(auth);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        createAccount,
        resetPassword,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
