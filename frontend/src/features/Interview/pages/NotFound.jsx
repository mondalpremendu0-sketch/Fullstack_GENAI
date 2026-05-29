import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import "../styles/NotFound.scss"; // We will create this next

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <motion.div 
                className="not-found-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* A subtle glowing 404 */}
                <motion.h1 
                    className="error-code"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                >
                    404
                </motion.h1>
                
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-text">
                    The page you are looking for doesn't exist or has been moved. 
                    Let's get you back on track.
                </p>

                <motion.button
                    className="back-home-btn"
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Dashboard
                </motion.button>
            </motion.div>
        </div>
    );
}