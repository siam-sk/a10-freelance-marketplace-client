import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show a loading indicator while checking auth status
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        // User is not authenticated, redirect to login page
        // Save the current location so user can be redirected back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated, render the child components
    return children;
};

export default PrivateRoute;