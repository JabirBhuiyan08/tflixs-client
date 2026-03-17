import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const ALLOWED_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

// Exchange Firebase ID token for backend JWT
const exchangeTokenWithBackend = async (firebaseUser) => {
  const idToken = await firebaseUser.getIdToken();
  const res = await api.post('/api/auth/firebase-login', { idToken });
  return res.data; // { token, admin }
};

// Save/clear token in localStorage (api.js interceptor reads it automatically)
const persistToken = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token);
  } else {
    localStorage.removeItem('adminToken');
  }
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]             = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Firebase auth state is the single source of truth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Single-admin gate
        if (ALLOWED_EMAIL && user.email !== ALLOWED_EMAIL) {
          await signOut(auth);
          setAdmin(null);
          setFirebaseUser(null);
          persistToken(null);
          setLoading(false);
          return;
        }
        setFirebaseUser(user);
        try {
          const { token, admin: adminData } = await exchangeTokenWithBackend(user);
          persistToken(token);
          setAdmin(adminData);
        } catch {
          // Backend exchange failed — still set minimal admin from Firebase
          setAdmin({ name: user.displayName || 'Admin', email: user.email, role: 'admin' });
        }
      } else {
        setFirebaseUser(null);
        setAdmin(null);
        persistToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (ALLOWED_EMAIL && email !== ALLOWED_EMAIL) {
      throw new Error('Access denied. You are not authorised to access this panel.');
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
    setAdmin(null);
    setFirebaseUser(null);
    persistToken(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!firebaseUser) throw new Error('Not authenticated');
    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
    await reauthenticateWithCredential(firebaseUser, credential);
    await updatePassword(firebaseUser, newPassword);
  };

  const getIdToken = async () => {
    if (!firebaseUser) return null;
    return firebaseUser.getIdToken(true);
  };

  return (
    <AuthContext.Provider value={{
      admin, firebaseUser, loading,
      login, logout, changePassword, getIdToken,
      isAuthenticated: !!admin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
