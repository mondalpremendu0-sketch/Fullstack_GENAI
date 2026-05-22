import React from "react";
import { motion } from "framer-motion";
import "../styles/Hero.scss";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const stats = [
  { number: "98%", label: "Accuracy" },
  { number: "3.2s", label: "Avg. Time" },
  { number: "10K+", label: "Reports" }
];

export default function Hero() {
  return (
    <motion.section
      className="hero"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="hero__eyebrow" variants={itemVariants}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        AI Interview Intelligence
      </motion.div>

      <motion.h1 className="hero__title" variants={itemVariants}>
        <span className="line">Ace Your Next</span>
        <span className="line gradient-text">Tech Interview</span>
      </motion.h1>

      <motion.p className="hero__subtitle" variants={itemVariants}>
        Upload your resume, describe your background, and get a personalized
        interview prep report powered by AI — in seconds.
      </motion.p>

      <motion.div className="hero__stats" variants={itemVariants}>
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <div className="hero__divider" />}
            <div className="hero__stat">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </motion.section>
  );
}
