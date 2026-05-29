import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuthContext"; 

export default function LogoutButton() {
    const { handleLogout,loading } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onLogoutClick = async () => {
        setIsLoggingOut(true);
        
        try {
          
       // Wait for the hook to finish clearing the session and state
        const success = await handleLogout();
        
        if (success) {
            // Kick them back to the login page
            navigate("/login", { replace: true }); 
            // 'replace: true' prevents them from hitting the "Back" button to return to the protected page
        } else setIsLoggingOut(false);
        } catch (err) {
          setIsLoggingOut(false);
          console.error(err);
        }
    };


    return (
        <motion.button 
            className="logout-btn"
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            
        >
            {isLoggingOut ? (
                <span>Logging out...</span>
            ) : (
                <>
                    {/* A clean exit icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    {/* Span wrapper for mobile hiding */}
                    <span className="btn-text">Sign Out</span>
                </>
            )}
        </motion.button>
    );
}