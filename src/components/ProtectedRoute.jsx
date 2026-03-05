import React from 'react';
import { Navigate, useParams } from 'react-router';
import { useAuth } from '../../AuthContext/UserAuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], requireClubRole = null }) => {
    const { user, authStatus, isLoading } = useAuth();
    const { id } = useParams(); // Assuming route param is :id for clubId

    if (isLoading) return <div className="p-10 text-center text-white">Loading...</div>;

    if (!authStatus) return <Navigate to="/login" replace />;

    // Global Role Check
    if (allowedRoles.length > 0) {
        // user.globalRole might be undefined if not synced yet, but isLoading should handle that.
        // If synced but no role (shouldn't happen), default to 'user'
        const role = user?.globalRole || 'user';
        if (!allowedRoles.includes(role)) {
            console.warn(`User role ${role} not enabled for this route.`);
            return <Navigate to="/" replace />;
        }
    }

    // Club Role Check
    if (requireClubRole) {
        const clubId = id; // From URL params
        if (!clubId) {
            console.warn("Club Role check required but no clubId found in params.");
            // If we can't determine club, we shouldn't grant access if checking for club role
            return <Navigate to="/clubs" replace />;
        }

        const membership = user.memberships?.find(m => m.clubId === clubId);

        if (!membership) {
            console.warn("User is not a member of this club.");
            return <Navigate to={`/clubs`} replace />;
        }

        const rolesToCheck = Array.isArray(requireClubRole) ? requireClubRole : [requireClubRole];
        if (!rolesToCheck.includes(membership.role)) {
            console.warn("User does not have required club role.");
            return <Navigate to={`/clubs`} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
