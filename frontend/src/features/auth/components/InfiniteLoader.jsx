import React from "react";
import { motion } from "framer-motion";

export default function InfiniteLoader() {
    // A smooth figure-eight (infinity) path using cubic beziers
    const infinityPath =
        "M 40,50 C 40,20 80,20 100,50 C 120,80 160,80 160,50 C 160,20 120,20 100,50 C 80,80 40,80 40,50 Z";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#111111"
            }}
        >
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
                    stroke="#2a2d36"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Animated Pink Segment */}
                <motion.path
                    d={infinityPath}
                    fill="transparent"
                    stroke="#e81cff"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0.25, pathOffset: 0 }}
                    animate={{ pathOffset: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </svg>
        </div>
    );
}
