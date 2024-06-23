import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "./Provider";

const ProtectedRoute = () => {
    const location = useLocation();
    const { user } = useContext(GlobalContext);

    // Return the Element if login is true else Navigate to /login.
    return user ? <Outlet /> : <Navigate to="/login" replace // replace /home route or state when user is not logged in and trying to access protective routes.
        state={{ from: location }} />;
}

export default ProtectedRoute