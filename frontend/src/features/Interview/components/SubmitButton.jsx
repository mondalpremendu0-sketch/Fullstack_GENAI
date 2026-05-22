import React from "react";
import { motion } from "framer-motion";
import "../styles/SubmitButton.scss";

export default function SubmitButton({ isLoading, isDisabled }) {
  return (
    <motion.button
      type="submit"
      className={`submit-btn ${isLoading ? "submit-btn--loading" : ""}`}
      disabled={isDisabled || isLoading}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner" />
          Analyzing...
        </>
      ) : (
        <>
          Generate Report
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </>
      )}
    </motion.button>
  );
}
