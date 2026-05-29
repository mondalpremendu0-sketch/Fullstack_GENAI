import React, { useState } from "react";
import { motion } from "framer-motion";
import {useParams} from 'react-router'
import html2pdf from "html2pdf.js"

import {useInterview} from '../hooks/useInterviewContext.js'
import ErrorModal from '../components/ErrorModal.jsx'

export default function ResumeDownloadButton() {
    // State to track if the PDF is currently being generated
    const {handlegetHtml} = useInterview();
    const {interviewId} = useParams();
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    

    const handleDownload = async () => {
        setIsGenerating(true);
        setPdfError(null);
        try {
            // 1. Fetch the HTML string
            const response = await handlegetHtml(interviewId);
            if (!response) {
                setPdfError("We could not fetch your resume layout from the server. Please try again.");
                return; 
            }

            const htmlString = `${response}`;

            // 2. Configure html2pdf for perfect A4 rendering
            const options = {
                margin: 0,
                filename: `${interviewId}-Resume.pdf`,
                image: {
                    type: "jpeg",
                    quality: 1,
                },
                html2canvas: {
                    scale: 2, 
                    useCORS: true,
                    windowWidth: 800 
                },
                jsPDF: {
                    unit: "mm", 
                    format: "a4",
                    orientation: "portrait",
                },
            };

            await html2pdf()
                .set(options)
                .from(htmlString)
                .save();
} 
        catch (error) {
            console.error("Failed to download PDF", error);
            setPdfError("An unexpected error occurred while building your PDF file. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
      <>
        <button 
            className="resume-download-btn" // Make sure this matches your SCSS
            onClick={handleDownload}
            disabled={isGenerating}
            style={{
                opacity: isGenerating ? 0.8 : 1,
                cursor: isGenerating ? "not-allowed" : "pointer"
            }}
        >
            {isGenerating ? (
                // --- THE FLOATING DOT LOADER ---
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Generating PDF</span>
                    <motion.div 
                        style={{ display: "flex", gap: "4px", paddingTop: "4px" }}
                        initial="start"
                        animate="start"
                    >
                        {/* Dot 1 */}
                        <motion.span 
                            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                        />
                        {/* Dot 2 */}
                        <motion.span 
                            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                        />
                        {/* Dot 3 */}
                        <motion.span 
                            style={{ width: "5px", height: "5px", backgroundColor: "#fff", borderRadius: "50%" }}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        />
                    </motion.div>
                </div>
            ) : (
                // --- NORMAL BUTTON STATE ---
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Resume PDF
                </>
            )}
        </button>
            <ErrorModal 
                isOpen={!!pdfError} 
                onClose={() => setPdfError(null)} 
                title="Download Failed"
                message={pdfError} 
            />
      </>
        
    );
}