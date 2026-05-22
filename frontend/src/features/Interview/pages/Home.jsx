import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Homepage.scss';

// --- Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const errorTextVariants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  show: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.2 } }
};

const shakeVariants = {
  rest: { x: 0 },
  shake: { 
    x: [0, -8, 8, -8, 8, -4, 4, 0], 
    transition: { duration: 0.4, type: "tween", ease: "easeInOut" } 
  }
};

export default function HomePage() {
  const [formData, setFormData] = useState({
    jobDescription: '',
    aboutYourself: '',
    resume: null // Now stores the actual File object
  });
  
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // --- File Handling Logic ---
  const processFile = (file) => {
    if (!file) return;
    
    // Check if it's a PDF
    if (file.type !== "application/pdf") {
      setErrors(prev => ({ ...prev, resume: "Please upload a valid PDF file." }));
      return;
    }
    
    // Check size (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: "File size must be under 10MB." }));
      return;
    }

    setFormData(prev => ({ ...prev, resume: file }));
    if (errors.resume) setErrors(prev => ({ ...prev, resume: null }));
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  // --- Form Validation ---
  const handleValidation = (e) => {
    e.preventDefault();
    setSubmitCount(prev => prev + 1);
    let newErrors = {};

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Please paste the job description.";
    } else if (formData.jobDescription.length < 50) {
      newErrors.jobDescription = "Job description is too short to generate a good report.";
    }

    if (!formData.aboutYourself.trim()) {
      newErrors.aboutYourself = "Please describe your background.";
    }

    if (!formData.resume) {
      newErrors.resume = "A resume in PDF format is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form is valid! Submitting...", formData);
      // Proceed with submission API call here using formData.resume
    }
  };

  return (
    <div className="app-container">
      <div className="bg-glow"></div>

      <nav className="max-w-wrapper navbar">
        <motion.div className="logo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="icon">AI</div>
          <span>PrepGenius</span>
        </motion.div>
        
        <motion.div className="status-badge" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="dot"></div>
          AI-Powered Analysis
        </motion.div>
      </nav>

      <main className="max-w-wrapper">
        <header className="hero">
          <motion.div className="pill" variants={fadeUpVariants} initial="hidden" animate="show">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            AI INTERVIEW INTELLIGENCE
          </motion.div>
          
          <motion.h1 variants={fadeUpVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
            Ace Your Next <br />
            <span className="gradient-text">Tech Interview</span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
            Upload your resume, describe your background, and get a personalized interview prep report powered by AI — in seconds.
          </motion.p>
        </header>

        <div className="content-grid">
          {/* LEFT: FORM */}
          <motion.div className="form-card" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="form-header">
              <h2>Generate Your Interview Report</h2>
              <p>Fill in the details below — the more context you give, the better your report.</p>
            </div>

            <motion.form variants={containerVariants} initial="hidden" animate="show" onSubmit={handleValidation}>
              
              {/* Job Description */}
              <motion.div className="form-group" variants={itemVariants}>
                <label>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  Job Description <span className="required">*</span>
                </label>
                <motion.div className="input-wrapper" variants={shakeVariants} animate={errors.jobDescription ? "shake" : "rest"} key={`job-desc-${submitCount}`}>
                  <textarea 
                    rows="4" 
                    placeholder="Paste the full job description here..."
                    className={errors.jobDescription ? 'has-error' : ''}
                    value={formData.jobDescription}
                    onChange={(e) => {
                      setFormData({...formData, jobDescription: e.target.value});
                      if (errors.jobDescription) setErrors({...errors, jobDescription: null});
                    }}
                  />
                  <div className="char-count">{formData.jobDescription.length} / 3000</div>
                </motion.div>
                
                <AnimatePresence>
                  {errors.jobDescription && (
                    <motion.span className="error-message" variants={errorTextVariants} initial="hidden" animate="show" exit="exit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.jobDescription}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* About Yourself */}
              <motion.div className="form-group" variants={itemVariants}>
                <label>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  About Yourself <span className="required">*</span>
                </label>
                <motion.div className="input-wrapper" variants={shakeVariants} animate={errors.aboutYourself ? "shake" : "rest"} key={`about-you-${submitCount}`}>
                  <textarea 
                    rows="4" 
                    placeholder="Describe your background, skills, projects..."
                    className={errors.aboutYourself ? 'has-error' : ''}
                    value={formData.aboutYourself}
                    onChange={(e) => {
                      setFormData({...formData, aboutYourself: e.target.value});
                      if (errors.aboutYourself) setErrors({...errors, aboutYourself: null});
                    }}
                  />
                  <div className="char-count">{formData.aboutYourself.length} / 2000</div>
                </motion.div>
                
                <AnimatePresence>
                  {errors.aboutYourself && (
                    <motion.span className="error-message" variants={errorTextVariants} initial="hidden" animate="show" exit="exit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.aboutYourself}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Resume Upload */}
              <motion.div className="form-group" variants={itemVariants}>
                <label>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Resume / CV <span className="required">*</span>
                </label>
                
                {/* Hidden Real File Input */}
                <input 
                  type="file" 
                  accept=".pdf" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />

                <motion.div 
                  className={`upload-area ${errors.resume ? 'has-error' : ''} ${isDragging ? 'is-dragging' : ''}`}
                  variants={shakeVariants}
                  animate={errors.resume ? "shake" : "rest"}
                  key={`resume-${submitCount}`}
                  whileHover={!errors.resume && !isDragging ? { scale: 1.01 } : {}} 
                  whileTap={{ scale: 0.99 }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="icon-wrapper">
                    {formData.resume ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    )}
                  </div>
                  <p className="main-text">
                    {formData.resume ? (
                      <span style={{ color: '#fff' }}>{formData.resume.name}</span>
                    ) : (
                      <>Drop your PDF here or <span>browse files</span></>
                    )}
                  </p>
                  <p className="sub-text">
                    {formData.resume ? "Click to change file" : "PDF format only • Max 10MB"}
                  </p>
                </motion.div>

                <AnimatePresence>
                  {errors.resume && (
                    <motion.span className="error-message" variants={errorTextVariants} initial="hidden" animate="show" exit="exit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {errors.resume}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div className="security-note" variants={itemVariants}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <p>Your data is processed securely and never stored.</p>
              </motion.div>

              <motion.button 
                type="submit"
                className="submit-btn" 
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: "#8B6FFF" }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Report
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </motion.button>
            </motion.form>
          </motion.div>

          {/* ... Features stack remains the exact same as before ... */}
          <motion.div className="features-stack" variants={containerVariants} initial="hidden" animate="show">
            {/* Feature 1 */}
            <motion.div className="feature-card" variants={itemVariants} whileHover={{ x: 5, borderColor: "rgba(109, 74, 255, 0.4)" }}>
              <div className="icon-box red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </div>
              <div>
                <h3>Match Score</h3>
                <p>See how well your profile aligns with the job requirements instantly.</p>
              </div>
            </motion.div>
            {/* Feature 2 */}
            <motion.div className="feature-card" variants={itemVariants} whileHover={{ x: 5, borderColor: "rgba(109, 74, 255, 0.4)" }}>
              <div className="icon-box yellow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <div>
                <h3>Smart Questions</h3>
                <p>Get tailored technical and behavioral questions unique to your background.</p>
              </div>
            </motion.div>
            {/* Feature 3 */}
            <motion.div className="feature-card" variants={itemVariants} whileHover={{ x: 5, borderColor: "rgba(109, 74, 255, 0.4)" }}>
              <div className="icon-box green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
              </div>
              <div>
                <h3>Prep Roadmap</h3>
                <p>A day-by-day study plan to close skill gaps before your interview.</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}