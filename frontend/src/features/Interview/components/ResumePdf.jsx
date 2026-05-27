import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useParams } from "react-router";
import { useInterview } from '../hooks/useInterviewContext.js';

const ResumeDownloadButton = ({ candidateId }) => {
    const { handlegetHtml } = useInterview();
    const { interviewId } = useParams();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            // 1. Fetch the HTML string
            const response = await handlegetHtml(interviewId);
            if (!response) {
                alert("HTML not received!");
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
                    // Force a desktop-sized width so mobile doesn't squash the layout
                    windowWidth: 800 
                },
                jsPDF: {
                    // MUST be mm, in, or pt for standard paper formats
                    unit: "mm", 
                    format: "a4",
                    orientation: "portrait",
                },
            };

            // 3. Pass the raw HTML string directly into .from()
            // No need for hidden refs or timeouts!
            await html2pdf()
                .set(options)
                .from(htmlString)
                .save();

        } catch (error) {
            console.error(error);
            alert("PDF generation failed");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handleDownload} 
                disabled={isDownloading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isDownloading ? '#cccccc' : '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isDownloading ? 'not-allowed' : 'pointer'
                }}
            >
                {isDownloading ? 'Generating PDF...' : 'Download Resume PDF'}
            </button>
        </div>
    );
};

export default ResumeDownloadButton;