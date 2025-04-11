
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    // Display a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    // Redirect to the auth page if not authenticated
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
