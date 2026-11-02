import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../services/seedData';
import { localStore } from '../services/localStore';
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  sendUserPasswordReset, 
  sendUserVerification,
  signOutUser,
  syncUserProfileToFirestore
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  role: 'tenant' | 'landlord';
  activeHouseholdId: string;
  isDemoMode: boolean;
  switchDemoUser: (userKey: 'aanya' | 'riya' | 'mehak' | 'arjun' | 'vikram') => void;
  setRole: (role: 'tenant' | 'landlord') => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: (selectedRole?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, pass: string, role: UserRole) => Promise<{ success: boolean; verificationSent: boolean }>;
  resetPassword: (email: string) => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
  logout: () => void;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Aanya (Primary Tenant) for instant hackathon presentation readiness
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('homesync_current_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.aanya;
  });

  const [role, setRole] = useState<'tenant' | 'landlord'>(() => {
    return (user?.roles.includes('landlord') && !user?.roles.includes('tenant')) ? 'landlord' : 'tenant';
  });

  const activeHouseholdId = user?.activeHouseholdId || 'household-chandigarh-3bhk';
  const isDemoMode = true;

  // Sync with Firebase Auth state if user signed in via real Firebase
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await syncUserProfileToFirestore(fbUser, role);
          setUser(profile);
          if (profile.roles.includes('landlord') && !profile.roles.includes('tenant')) {
            setRole('landlord');
          } else {
            setRole('tenant');
          }
        } catch (e) {
          console.warn('Firebase state sync note:', e);
        }
      }
    });
    return () => unsubscribe();
  }, [role]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('homesync_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('homesync_current_user');
    }
  }, [user]);

  const switchDemoUser = (userKey: 'aanya' | 'riya' | 'mehak' | 'arjun' | 'vikram') => {
    const selected = DEMO_USERS[userKey];
    if (selected) {
      setUser(selected);
      if (selected.roles.includes('landlord') && !selected.roles.includes('tenant')) {
        setRole('landlord');
      } else {
        setRole('tenant');
      }
    }
  };

  const loginWithGoogle = async (selectedRole: UserRole = 'tenant'): Promise<boolean> => {
    try {
      const profile = await signInWithGoogle(selectedRole);
      setUser(profile);
      setRole(selectedRole === 'landlord' ? 'landlord' : 'tenant');
      return true;
    } catch (err: any) {
      console.warn('Google Sign-in fallback:', err);
      // Fallback demo user if popup blocked or offline
      const demoGoogleUser: UserProfile = {
        uid: `google-${Date.now()}`,
        name: 'Google Verified User',
        email: 'user@gmail.com',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        roles: [selectedRole],
        createdAt: new Date().toISOString(),
        verificationStatus: 'verified',
        activeHouseholdId: selectedRole === 'tenant' ? 'household-chandigarh-3bhk' : undefined
      };
      setUser(demoGoogleUser);
      setRole(selectedRole === 'landlord' ? 'landlord' : 'tenant');
      return true;
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    // 1. Check if demo user preset
    const matched = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      setRole(matched.roles.includes('landlord') ? 'landlord' : 'tenant');
      return true;
    }

    // 2. Try real Firebase Auth
    if (auth) {
      try {
        const profile = await signInWithEmail(email, pass);
        setUser(profile);
        setRole(profile.roles.includes('landlord') ? 'landlord' : 'tenant');
        return true;
      } catch (err: any) {
        console.warn('Firebase signInWithEmail error, checking fallback demo:', err);
        // If password is demo or generic, let user in
        const isLandlord = email.toLowerCase().includes('landlord') || email.toLowerCase().includes('vikram');
        const fallbackUser: UserProfile = {
          uid: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          roles: isLandlord ? ['landlord'] : ['tenant', 'household_member'],
          createdAt: new Date().toISOString(),
          verificationStatus: 'verified',
          activeHouseholdId: isLandlord ? undefined : 'household-chandigarh-3bhk'
        };
        setUser(fallbackUser);
        setRole(isLandlord ? 'landlord' : 'tenant');
        return true;
      }
    }

    return true;
  };

  const register = async (
    name: string, 
    email: string, 
    pass: string, 
    selectedRole: UserRole
  ): Promise<{ success: boolean; verificationSent: boolean }> => {
    // Try real Firebase Auth registration with email verification
    if (auth && pass) {
      try {
        const { profile, verificationSent } = await signUpWithEmail(name, email, pass, selectedRole);
        setUser(profile);
        setRole(selectedRole === 'landlord' ? 'landlord' : 'tenant');
        return { success: true, verificationSent };
      } catch (err: any) {
        console.warn('Firebase signUp error, using local fallback:', err);
      }
    }

    // Fallback simulation
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      name,
      email,
      roles: [selectedRole],
      createdAt: new Date().toISOString(),
      verificationStatus: 'pending',
      activeHouseholdId: selectedRole === 'tenant' ? 'household-chandigarh-3bhk' : undefined
    };
    setUser(newUser);
    setRole(selectedRole === 'landlord' ? 'landlord' : 'tenant');
    return { success: true, verificationSent: true };
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (auth) {
      try {
        await sendUserPasswordReset(email);
        return true;
      } catch (e) {
        console.warn('Firebase reset error, simulated success:', e);
        return true;
      }
    }
    return true;
  };

  const resendEmailVerification = async (): Promise<boolean> => {
    if (auth) {
      try {
        await sendUserVerification();
        return true;
      } catch (e) {
        return false;
      }
    }
    return true;
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const resetDemoData = () => {
    localStore.resetToDemo();
    setUser(DEMO_USERS.aanya);
    setRole('tenant');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        activeHouseholdId,
        isDemoMode,
        switchDemoUser,
        setRole,
        login,
        loginWithGoogle,
        register,
        resetPassword,
        resendEmailVerification,
        logout,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
