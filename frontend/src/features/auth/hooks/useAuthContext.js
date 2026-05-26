import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleRegister = async ({ firstname, lastname, email, password }) => {
        try {
            setLoading(true);
            const data = await register({
                firstname,
                lastname,
                email,
                password
            });

            setUser(data.user);
        } catch (err) {
            // console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });

            setUser(data.user);
        } catch (err) {
            //console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            const data = await logout();
            setUser(null);
        } catch (err) {
            //console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                //console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return { user, loading, handleRegister, handleLogin, handleLogout };
};
