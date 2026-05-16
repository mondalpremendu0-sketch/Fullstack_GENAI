import React from "react";
import { motion } from "framer-motion";

export default function InfiniteLoader() {
  // Shared styles for the ripple circles
  const circleStyle = {
    position: "absolute",
    border: "4px solid #e81cff", // Vibrant magenta/pink
    borderRadius: "50%",
    boxSizing: "border-box", // Ensures the border expands neatly from the center
  };

  // Shared animation timing
  const transitionProps = {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeOut", // Starts fast, slows down as it fades out
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#111111", // Dark background matching the video
      position: "relative"
    }}>
      {/* First Ripple */}
      <motion.div
        style={circleStyle}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 120, height: 120, opacity: 0 }}
        transition={transitionProps}
      />
      
      {/* Second Ripple */}
      <motion.div
        style={circleStyle}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 120, height: 120, opacity: 0 }}
        // Delay the second ripple by exactly half the duration of the first
        transition={{ ...transitionProps, delay: 0.75 }}
      />
    </div>
  );

}