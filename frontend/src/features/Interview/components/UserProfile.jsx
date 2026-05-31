// components/UserProfile.jsx
import React from "react";
import { useAuth } from "../../auth/hooks/useAuthContext.js";
import '../styles/UserProfile.scss'
export default function UserProfile() {
    const { user } = useAuth();
    // 1. Fallback Logic for Name
    // Tries to use the Google Display Name, falls back to the first part of their email, or "Guest"
    const displayName = user?.displayName || user?.firstname + " " +user?.lastname|| (user?.email ? user.email.split('@')[0] : "Guest");

    // 2. Fallback Logic for Avatar
    // Tries to use the Google Photo URL, falls back to a clean default SVG
    const avatarUrl = user?.profilePicture || user?.picture || null;

    return (
        <div className="user-profile">
            <div className="avatar-container">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="avatar-image" />
                ) : (
                    // Default Empty User Avatar (SVG)
                    <div className="default-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                )}
            </div>
            
            {/* Display the username underneath */}
            <span className="user-name">{displayName}</span>
        </div>
    );
}