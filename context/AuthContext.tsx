"use client";

import * as React from "react";
import { firebaseAuth } from "@/lib/firebase.client";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    if (!firebaseAuth) {
      throw new Error("Firebase is not initialized");
    }
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const signup = React.useCallback(
    async (name: string, email: string, password: string) => {
      if (!firebaseAuth) {
        throw new Error("Firebase is not initialized");
      }

      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      if (credential.user) {
        await updateProfile(credential.user, { displayName: name });
      }
    },
    []
  );

  const logout = React.useCallback(async () => {
    if (!firebaseAuth) {
      throw new Error("Firebase is not initialized");
    }
    await signOut(firebaseAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
