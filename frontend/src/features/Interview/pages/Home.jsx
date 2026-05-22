import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Homepage.scss';

const HomePage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  // Handle file selection (click or drag)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else if (file) {
      alert('Please upload a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      jobDescription,
      selfDescription,
      resumeFile: resumeFile ? resumeFile.name : null
    });
    // Add your submission logic here
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="home-container">
      <motion.div 
        className="content-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="header-section" variants={itemVariants}>
          <h1>Profile Matcher</h1>
          <p>Provide the job details and your information to see how well you align with the position.</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              placeholder="Paste the requirements and responsibilities of the job here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              id="selfDescription"
              placeholder="Describe your skills, experience, and why you are a good fit..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              required
            />
          </motion.div>

          <motion.div className="file-upload-wrapper" variants={itemVariants}>
            <label>Resume (PDF only)</label>
            
            {!resumeFile ? (
              <div 
                className={`drop-zone ${isDragging ? 'active' : ''}`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Upload Icon SVG */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span className="upload-text">Click to upload or drag and drop</span>
                <span className="upload-hint">PDF files up to 5MB</span>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="selected-file">
                <span>📄 {resumeFile.name}</span>
                <button type="button" onClick={clearFile}>Remove</button>
              </div>
            )}
          </motion.div>

          <motion.button 
            type="submit" 
            className="submit-btn"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!jobDescription || !selfDescription || !resumeFile}
          >
            Analyze Profile
          </motion.button>
          
        </form>
      </motion.div>
    </div>
  );
};

export default HomePage;