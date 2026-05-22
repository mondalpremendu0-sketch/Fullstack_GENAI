import React from "react";
import { motion } from "framer-motion";
import "../styles/Features.scss";

const features = [
  {
    icon: "🎯",
    variant: "purple",
    title: "Match Score",
    desc: "See how well your profile aligns with the job requirements instantly."
  },
  {
    icon: "💡",
    variant: "gold",
    title: "Smart Questions",
    desc: "Get tailored technical and behavioral questions unique to your background."
  },
  {
    icon: "📈",
    variant: "green",
    title: "Prep Roadmap",
    desc: "A day-by-day study plan to close skill gaps before your interview."
  }
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Features() {
  return (
    <motion.div
      className="features"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          className="feature-card"
          variants={cardVariants}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`feature-card__icon feature-card__icon--${f.variant}`}>
            {f.icon}
          </div>
          <h3 className="feature-card__title">{f.title}</h3>
          <p className="feature-card__desc">{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
