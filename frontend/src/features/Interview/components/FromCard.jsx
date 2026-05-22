import React, { useState } from "react";
import { motion } from "framer-motion";
import TextAreaField from "./TextAreaField";
import FileUpload from "./FileUpload";
import SubmitButton from "./SubmitButton";
import "../styles/FromCard.scss";

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
  }
};

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function FormCard() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = jobDescription.trim() && selfDescription.trim() && resumeFile;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    try {
      const res = await fetch("/api/interview/", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      console.log("Report:", data);
      // TODO: navigate to report page
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="form-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="form-card__header">
        <h2>Generate Your Interview Report</h2>
        <p>Fill in the details below — the more context you give, the better your report.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card__grid">

          {/* Job Description */}
          <div className="form-card__full">
            <TextAreaField
              label="Job Description"
              icon={<BriefcaseIcon />}
              placeholder="Paste the full job description here — role, responsibilities, required skills, tech stack..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              maxLength={3000}
              rows={7}
            />
          </div>

          {/* Self Description */}
          <div className="form-card__full">
            <TextAreaField
              label="About Yourself"
              icon={<UserIcon />}
              placeholder="Describe your background, skills, projects, and experience. Be as detailed as possible..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              required
              maxLength={2000}
              rows={6}
            />
          </div>

          {/* File Upload */}
          <div className="form-card__full">
            <FileUpload file={resumeFile} onChange={setResumeFile} />
          </div>

        </div>

        <div className="form-card__footer">
          <div className="form-card__note">
            <ShieldIcon />
            Your data is processed securely and never stored.
          </div>
          <SubmitButton isLoading={isLoading} isDisabled={!isValid} />
        </div>
      </form>
    </motion.div>
  );
}
