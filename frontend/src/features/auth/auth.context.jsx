import { createContext, useState , useEffect} from "react";
import {getMe} from './services/auth.api.js'

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalErrors, setGlobalErrors] = useState(null);
    
    useEffect(() => {
        const getAndSetUser = async () => {
          
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                if (err.status === 401) {
                    setUser(null); 
                } else {
                    setGlobalErrors("Could not connect to the authentication server.");
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);
    
    

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading,globalErrors, setGlobalErrors }}>
            {children}
        </AuthContext.Provider>
    );
};
