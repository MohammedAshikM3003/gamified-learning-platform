import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { isAuthenticated, loading, onboardingCompleted } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f0f1e 0%, #1a0f2e 100%)',
        }}
      >
        <div style={{ color: '#fff', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};
