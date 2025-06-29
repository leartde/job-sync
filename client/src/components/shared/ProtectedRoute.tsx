import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/authentication/useAuth.ts";

const ProtectedRoute = ({ children, requireLogin, role }: { children,requireLogin,role? }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user && requireLogin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user && !requireLogin && user.role == "jobseeker") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (user && user.role != role) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
