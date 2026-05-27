import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Loading.scss';

export default function AILoadingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);

  // The sequence of messages the AI shows while "thinking"
  const loadingMessages = [
    "Analyzing your resume & background...",
    "Cross-referencing with job description...",
    "Extracting key technical skills...",
    "Generating tailored interview questions...",
    "Finalizing your personalized prep roadmap..."
  ];

  // Cycle through the messages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <motion.div 
      className="ai-loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="spinner-container">
        {/* Glowing background effect */}
        <motion.div 
          className="glow"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Gradient Spinner */}
        <motion.svg
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74" />  {/* Orange */}
              <stop offset="50%" stopColor="#f472b6" /> {/* Pink */}
              <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="8" 
          />
          {/* Animated Gradient Progress */}
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="url(#spinnerGradient)" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray="180 250" // Creates a gap in the circle
          />
        </motion.svg>
      </div>

      <motion.h2 
        className="loading-title"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Building Your Interview Report
      </motion.h2>

      <div className="loading-status">
        <AnimatePresence mode="wait">
          <motion.div
            key={statusIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loadingMessages[statusIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}