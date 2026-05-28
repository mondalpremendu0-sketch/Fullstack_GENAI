import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ErrorModal.scss";

// A clean, professional warning icon
const WarningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const ErrorModal = ({ isOpen, onClose, title = "Generation Failed", message }) => {
    // Prevent scrolling on the body when the modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-container">
                    {/* The blurred backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} // Clicking outside closes it
                    />

                    {/* The actual pop-up card */}
                    <motion.div
                        className="neo-modal"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="modal-header">
                            <WarningIcon />
                            <h3>{title}</h3>
                        </div>
                        
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>

                        <div className="modal-footer">
                            <motion.button 
                                className="neo-button outline" 
                                onClick={onClose}
                                whileTap={{ scale: 0.95 }}
                            >
                                Try Again
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ErrorModal;