import { useContext, useEffect ,useState} from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading,setGlobalErrors } = context;
    const [authError,setAuthError] = useState(null);

    const handleRegister = async ({ firstname, lastname, email, password }) => {
        try {
            setLoading(true);
            setAuthError(null)
            const data = await register({
                firstname,
                lastname,
                email,
                password
            });

            setUser(data.user);
            return true
        } catch (err) {
          setAuthError(err.message);
          return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            setAuthError(null);
            const data = await login({ email, password });

            setUser(data.user);
            return true
        } catch (err) {
          setAuthError(err.message);
          return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
             await logout();
            setUser(null);
            return true
        } catch (err) {
            setGlobalErrors("failed to logout properly",err.message)
            return false;
        } finally {
            setLoading(false);
        }
    };

    

    return { user, loading,authError ,handleRegister, handleLogin, handleLogout };
};
