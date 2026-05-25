import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService.js';
import { firestoreService } from '../services/firestoreService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          const profile = await firestoreService.getUserProfile(authUser.uid);
          setUserProfile(profile);

          // Subscribe to realtime profile updates so settings changes propagate immediately
          if (unsubscribeProfile) unsubscribeProfile();
          unsubscribeProfile = firestoreService.subscribeToProfile(authUser.uid, (data) => {
            setUserProfile(data);
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err.message);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signup = async (email, password, fullName) => {
    try {
      setError(null);
      const authUser = await authService.signupWithEmail(email, password, fullName);
      await firestoreService.createUserProfile(authUser.uid, {
        fullName,
        email,
        onboardingCompleted: false,
      });
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signupWithGoogle = async () => {
    try {
      setError(null);
      const authUser = await authService.signupWithGoogle();
      const existingProfile = await firestoreService.getUserProfile(authUser.uid);
      
      if (!existingProfile) {
        await firestoreService.createUserProfile(authUser.uid, {
          fullName: authUser.displayName || 'User',
          email: authUser.email,
          onboardingCompleted: false,
        });
      }
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      return await authService.loginWithEmail(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      return await authService.loginWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      setError(null);
      if (user) {
        await firestoreService.completeOnboarding(user.uid, onboardingData);
        const updatedProfile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(updatedProfile);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    signupWithGoogle,
    login,
    loginWithGoogle,
    logout,
    completeOnboarding,
    isAuthenticated: !!user,
    onboardingCompleted: userProfile?.onboardingCompleted || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
