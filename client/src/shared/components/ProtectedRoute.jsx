import { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/config/constants';
import Loader from './Loader';

/**
 * Route protector component that checks authentication state
 * and redirects unauthenticated users or users with wrong roles.
 */
const ProtectedRoute = ({ requireAdmin = false }) => {
    const { isAuthenticated, isAdminAuthenticated, verify } = useAuth();
    const location = useLocation();

    // Verify token validity occasionally (optional enhancement)
    // Uncomment this if you implement the verify function fully
    /*
    useEffect(() => {
        const checkToken = async () => {
            try {
                await verify();
            } catch (err) {
                // If verification fails, AuthContext handles logout automatically
                console.error("Session invalid");
            }
        };
        // Maybe only check periodically or on first mount
    }, [verify]);
    */

    // If route requires admin but user isn't an admin
    if (requireAdmin && !isAdminAuthenticated) {
        // They might be a regular customer trying to access admin
        return <Navigate to={ROUTES.ADMIN_LOGIN} state={{ from: location }} replace />;
    }

    // If route requires regular auth but user isn't authenticated
    if (!requireAdmin && !isAuthenticated && !isAdminAuthenticated) { // Allow admins into customer routes optionally
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // If authenticated correctly, render the child routes inside an Outlet
    return <Outlet />;
};

ProtectedRoute.propTypes = {
    requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;
