import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOutUser } from '../services/firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  role: 'donor' | 'partner' | 'member';
  organization?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfileData | null;
  authReady: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  authReady: false,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const isBootstrappedAdmin =
          firebaseUser.email === 'mugisolo@gmail.com' && firebaseUser.emailVerified;
        setIsAdmin(isBootstrappedAdmin);

        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            setProfile(snap.data() as UserProfileData);
          } else {
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Enganda Member',
              role: 'donor',
            });
          }
        } catch (err) {
          console.error('Error loading user profile from Firestore:', err);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await logOutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        authReady,
        isAdmin,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
