import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { UserRole, UserProfile } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCuNkAbm6B9ZAy_Re8BAlfORwECCGpoASQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "homesync-3c8a6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "homesync-3c8a6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "homesync-3c8a6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "423724531451",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:423724531451:web:8ce52d6f94b797d814ba5e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NDGERPJFTQ"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize analytics if supported in browser environment
    if (typeof window !== 'undefined') {
      isAnalyticsSupported().then(supported => {
        if (supported && app) {
          getAnalytics(app);
        }
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('Firebase initialization error, will use mock/local fallback:', err);
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, storage };

/**
 * Syncs user profile document to Firestore `users/{uid}`
 */
export async function syncUserProfileToFirestore(user: FirebaseUser, role: UserRole = 'tenant', customName?: string): Promise<UserProfile> {
  const userProfile: UserProfile = {
    uid: user.uid,
    name: customName || user.displayName || user.email?.split('@')[0] || 'HomeSync Member',
    email: user.email || '',
    phone: user.phoneNumber || undefined,
    profileImage: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    roles: [role],
    createdAt: new Date().toISOString(),
    verificationStatus: user.emailVerified ? 'verified' : 'pending',
    activeHouseholdId: role === 'tenant' ? 'household-chandigarh-3bhk' : undefined
  };

  if (db) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const existing = await getDoc(userRef);
      if (existing.exists()) {
        const data = existing.data() as UserProfile;
        return {
          ...data,
          verificationStatus: user.emailVerified ? 'verified' : data.verificationStatus
        };
      } else {
        await setDoc(userRef, {
          ...userProfile,
          serverTimestamp: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not write user profile to Firestore (will use local state):', e);
    }
  }

  return userProfile;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(role: UserRole = 'tenant'): Promise<UserProfile> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return syncUserProfileToFirestore(result.user, role);
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<UserProfile> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return syncUserProfileToFirestore(result.user);
}

/**
 * Sign up with Email and Password + sends Email Verification
 */
export async function signUpWithEmail(name: string, email: string, pass: string, role: UserRole = 'tenant'): Promise<{ profile: UserProfile; verificationSent: boolean }> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await createUserWithEmailAndPassword(auth, email, pass);

  if (name) {
    await updateProfile(result.user, { displayName: name });
  }

  let verificationSent = false;
  try {
    await sendEmailVerification(result.user);
    verificationSent = true;
  } catch (e) {
    console.warn('Verification email could not be sent immediately:', e);
  }

  const profile = await syncUserProfileToFirestore(result.user, role, name);
  return { profile, verificationSent };
}

/**
 * Send Password Reset Email
 */
export async function sendUserPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  await sendPasswordResetEmail(auth, email);
}

/**
 * Send Verification Email for current user
 */
export async function sendUserVerification(): Promise<void> {
  if (!auth?.currentUser) throw new Error('No user is currently signed in');
  await sendEmailVerification(auth.currentUser);
}

/**
 * Sign Out
 */
export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}
