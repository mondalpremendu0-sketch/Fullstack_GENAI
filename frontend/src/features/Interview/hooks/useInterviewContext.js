import {useContext,useEffect,useState} from "react";

import {generateInterviewReport,getInerviewById,getAllInterviewReports,
  gethtmlforResume
} from '../services/interView.api.js'
import {InterviewContext} from '../interView.context.jsx'


export const useInterview =  () => 
{
  const context = useContext(InterviewContext);
  const {Report,setReport,loading,setLoading,Reports,setReports,setGlobalError} = context;
  
  const [aiError,setAiError] = useState(null);
  
  const handleGenerateInterviewReport = async ({jobDescription,selfDescription,resumeFile})=> 
  {
    try 
    {
      setLoading(true);
      setAiError(null)
      const data = await generateInterviewReport({jobDescription,selfDescription,resumeFile});
      setReport(data.report);
      return data.report;
      return true;
    } catch (err) 
    {
      // Smart Routing: Is it a user error (400) or a server crash (500)?
      if (err.status <= 500) {
          setGlobalError("The AI engine is currently overloaded. Please try again.");
      } else {
          setAiError(err.message.message);
      }
      //console.log(err);
      return false // Return false so UI knows it failed
    }  finally {
      setLoading(false);
    }

  }
  
  const handleGetInterviewById = async (interviewId) => 
  {
    try {
      setLoading(true);
      const data = await getInerviewById(interviewId);
      setReport(data.report);
      return data.report;
      return true;
    } catch (err) {
      // If we can't fetch a report, that's a global error that should show a toast/alert
      setGlobalError(err.message || "Failed to load report.");
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  const handleGetAllInterviewReports = async () => 
  {
      setLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.reports)
      return data.reports;
      return true;
    } catch (err) {
      setGlobalError(err.message || "Failed to load your dashboard.");
      return false;
      
    } finally {
      setLoading(false);
    }
  }
  
  const handlegetHtml = async (interviewId) => {
    
    try {
      
      const data = await gethtmlforResume(interviewId)
      return data.htmlData
    } catch (err) {
      setGlobalError(err.message || "Failed to generate PDF layout.");
      return false;
      
    }
    
  }
  
  
  useEffect(() => {
        const getAllReportsAndset = async () => {
            try {
                const data = await getAllInterviewReports();
                setReports(data.reports);

            } catch (err) {
                setGlobalError("Can't fetched reports!")
            } 
        };

        getAllReportsAndset();
    }, []);
  
  
  return {
    Report,
    loading,
    setLoading,
    Reports,
    handleGenerateInterviewReport,
    handleGetInterviewById,
    handleGetAllInterviewReports,
    handlegetHtml,
    aiError,
    setAiError
    
  }
}