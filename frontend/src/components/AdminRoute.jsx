import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Not an admin
    if (user.role !== "ROLE_ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    // Admin
    return children;
}

export default AdminRoute;