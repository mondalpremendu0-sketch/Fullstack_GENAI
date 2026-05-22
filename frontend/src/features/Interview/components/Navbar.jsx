import React from "react";
import { motion } from "framer-motion";
import "../styles/Navbar.scss";

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <a className="navbar__logo" href="/">
        <div className="logo-mark">AI</div>
        <span className="logo-text">
          Prep<span>Genius</span>
        </span>
      </a>

      <div className="navbar__badge">
        <span className="dot" />
        AI-Powered Analysis
      </div>
    </motion.nav>
  );
}
