import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../hooks/authentication/useAuth.ts";

const ProtectedRoute = ({ children, login, role }: { children,login,role? }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user && login) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user && !login && user.role == "jobseeker") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (user && user.role != role) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
