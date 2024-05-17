import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";


const ProtectedRoute = () => {
    const { login } = useContext(AuthContext);
    console.log(login);
    // Return the Element if login is true else Navigate to /login.
    return  login ? <Outlet /> : <Navigate to="/login"/>;
}

export default ProtectedRoute