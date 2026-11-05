import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logOutUser } from '../services/firebase';

export interface AuthenticatedSession {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextValue {
  user: AuthenticatedSession | null;
  authReady: boolean;
  isGlobalAdmin: boolean;
  assignedGroupIds: string[];
  hasGroupAccess: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccess: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  authReady: false,
  isGlobalAdmin: false,
  assignedGroupIds: [],
  hasGroupAccess: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshAccess: async () => {},
  getAuthHeaders: () => ({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedSession | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isGlobalAdmin, setIsGlobalAdmin] = useState<boolean>(false);
  const [assignedGroupIds, setAssignedGroupIds] = useState<string[]>([]);

  const syncWithBackendSession = useCallback(async (sessionUser: AuthenticatedSession | null) => {
    if (!sessionUser || !sessionUser.email) {
      setIsGlobalAdmin(false);
      setAssignedGroupIds([]);
      return;
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': sessionUser.email,
          'x-user-uid': sessionUser.uid,
        },
        body: JSON.stringify({
          email: sessionUser.email,
          uid: sessionUser.uid,
          displayName: sessionUser.displayName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsGlobalAdmin(Boolean(data.isGlobalAdmin));
        setAssignedGroupIds(Array.isArray(data.assignedGroupIds) ? data.assignedGroupIds : []);
      }
    } catch (err) {
      console.error('[ENGANDA Auth] Failed to sync session:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const sessionData: AuthenticatedSession = {
          uid: firebaseUser.uid,
          email: firebaseUser.email.toLowerCase(),
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        };
        setUser(sessionData);
        await syncWithBackendSession(sessionData);
      } else {
        setUser(null);
        setIsGlobalAdmin(false);
        setAssignedGroupIds([]);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [syncWithBackendSession]);

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await logOutUser();
    setUser(null);
    setIsGlobalAdmin(false);
    setAssignedGroupIds([]);
  };

  const refreshAccess = async () => {
    if (user) {
      await syncWithBackendSession(user);
    }
  };

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!user || !user.email) return {};
    return {
      'x-user-email': user.email,
      'x-user-uid': user.uid,
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isGlobalAdmin,
        assignedGroupIds,
        hasGroupAccess: isGlobalAdmin || assignedGroupIds.length > 0,
        signIn: handleSignIn,
        signOut: handleSignOut,
        refreshAccess,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
