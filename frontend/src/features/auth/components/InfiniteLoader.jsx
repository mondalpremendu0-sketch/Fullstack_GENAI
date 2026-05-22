import React from "react";
import { motion } from "framer-motion";

export default function InfiniteLoader() {
  // A smooth figure-eight (infinity) path using cubic beziers
  const infinityPath = "M 40,50 C 40,20 80,20 100,50 C 120,80 160,80 160,50 C 160,20 120,20 100,50 C 80,80 40,80 40,50 Z";

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#111111" // Dark background matching the video
    }}>
      <svg
        width="200"
        height="100"
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Track */}
        <path
          d={infinityPath}
          fill="transparent"
          stroke="#2a2d36" // Dim grey color
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Pink Segment */}
        <motion.path
          d={infinityPath}
          fill="transparent"
          stroke="#e81cff" // Vibrant magenta/pink
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Keep the drawn segment to 25% of the total path length
          initial={{ pathLength: 0.25, pathOffset: 0 }}
          // Animate the offset from 0 to 1 to make it travel the full loop
          animate={{ pathOffset: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear", // Linear ease ensures the speed stays consistent
          }}
        />
      </svg>
    </div>
  );
}