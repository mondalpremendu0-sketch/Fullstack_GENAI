import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate ,Link} from "react-router";

import GoogleSignInButton from "../components/GoogleSignInButton.jsx";
import { useAuth } from "../hooks/useAuthContext.js";
//import Infinitloader from '../components/InfiniteLoader.jsx'

import "./Login.scss";
import "../styles/global.scss";

// SVG Icons

const IconEmail = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const IconLock = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconSun = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const IconMoon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// Main Login Component

const Login = () => {
    const { loading, handleLogin, authError,user } = useAuth();
    
    const navigate = useNavigate();
    
    const [theme, setTheme] = useState(
        localStorage.getItem("neo-theme") || "light"
    );
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
      if (user) {
        navigate("/");
      }
    },[user,navigate]);


    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    // Theme Sync Logic
    useEffect(() => {
        localStorage.setItem("neo-theme", theme);
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark-theme");
        } else {
            root.classList.remove("dark-theme");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    // Standard Email/Password Submission
    const onSubmit = async (data) => {
        //------ API call -----
        const success = await handleLogin(data);
        if (success) {
            reset();
            navigate("/");
        }
        console.log(data);
        console.log(success);
        
    };

    // Google Login Handler
    // Google Login Handler
const handleGoogleLogin = (e) => {
    e.preventDefault();
    // Dynamically uses localhost in dev, and Railway in production!
    window.location.href = `${import.meta.env.VITE_API_URL}/api/googleAuth/google`;
};


    // Framer Motion Animation Settings
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
                staggerChildren: 0.12
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="neo-container">
            <motion.div
                className="neo-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    {theme === "light" ? <IconMoon /> : <IconSun />}
                </button>

                <motion.h2 variants={itemVariants}>Welcome Back</motion.h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Display Backend Authentication Errors */}
                    <AnimatePresence>
                        {authError && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    marginBottom: 0
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                    marginBottom: 24
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                    marginBottom: 0
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut"
                                }}
                                style={{ overflow: "hidden" }} // <-- CRITICAL: Hides text while container grows
                            >
                                {/* We put the class on an inner div so the padding 
               doesn't mess up the height: 0 animation 
            */}
                                <div
                                    className="auth-error-banner"
                                    style={{ marginBottom: 0 }}
                                >
                                    {authError}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div className="input-group" variants={itemVariants}>
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <IconEmail />
                            </span>
                            <input
                                type="email"
                                placeholder="john.doe@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <span className="error-text">
                                {errors.email.message}
                            </span>
                        )}
                    </motion.div>

                    <motion.div className="input-group" variants={itemVariants}>
                        <label>Password</label>
                        <div className="input-wrapper with-password">
                            <span className="input-icon">
                                <IconLock />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", {
                                    required: "Password is required"
                                })}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="error-text">
                                {errors.password.message}
                            </span>
                        )}
                    </motion.div>

                    {/* New Login Actions Row */}
                    <motion.div
                        className="login-actions"
                        variants={itemVariants}
                    >
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                            />
                            Remember me
                        </label>
                        <Link to="/register" className="forgot-link">
                            <u>Create New Account</u>
                        </Link>
                    </motion.div>
                    {/* ✅ UPDATE THIS */}
                    <motion.button
                        type="submit"
                        className="neo-button"
                        variants={itemVariants}
                        disabled={loading} // Prevents double-clicking
                        whileTap={!loading ? { scale: 0.975 } : {}}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        style={{
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </motion.button>

                    {/*  Google Component */}
                    <GoogleSignInButton
                        onClick={handleGoogleLogin}
                        variants={itemVariants}
                    />
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
