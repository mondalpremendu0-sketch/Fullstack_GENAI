import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalErrors, setGlobalErrors] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading,globalErrors, setGlobalErrors }}>
            {children}
        </AuthContext.Provider>
    );
};
