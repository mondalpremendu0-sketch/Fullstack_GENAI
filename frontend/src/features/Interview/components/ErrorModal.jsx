import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ErrorModal.scss";

const WarningIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff4d4d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const ErrorModal = ({
    isOpen,
    onClose,
    title = "Download Failed",
    message
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="modal-container">
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="premium-modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 400
                        }}
                    >
                        {/* Soft ambient background glow */}
                        <div className="ambient-glow"></div>

                        <div className="modal-content">
                            <div className="icon-wrapper">
                                <div className="icon-pulse"></div>
                                <WarningIcon />
                            </div>

                            <h3 className="modal-title">{title}</h3>
                            <p className="modal-text">{message}</p>

                            <motion.button
                                className="premium-btn"
                                onClick={onClose}
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ y: -2 }}
                            >
                                Dismiss
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ErrorModal;
