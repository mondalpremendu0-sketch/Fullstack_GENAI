import {useContext,useEffect} from "react";
import {useParams} from 'react-router'
import {generateInterviewReport,getInerviewById,getAllInterviewReports,
  gethtmlforResume
} from '../services/interView.api.js'
import {interviewContext} from '../interView.context.jsx'


export const useInterview =  () => 
{
  const context = useContext(interviewContext);
  const {Report,setReport,loading,setLoading,Reports,setReports} = context;
  const {interviewId} = useParams();
  
  
  const handleGenerateInterviewReport = async ({jobDescription,selfDescription,resumeFile})=> 
  {
    try 
    {
      setLoading(true);
      const data = await generateInterviewReport({jobDescription,selfDescription,resumeFile});
      setReport(data.report);
      return data.report;
    } catch (err) 
    {
      //console.error('Error:', err);
    }  finally {
      setLoading(false);
    }

  }
  
  const handleGetInterviewById = async (interviewId) => 
  {
      setLoading(true);
    try {
      const data = await getInerviewById(interviewId);
      setReport(data.report);
      return data.report;
    } catch (err) {
     // console.error('Error:', err);
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
    } catch (err) {
     // console.error('Error:', err);
      
    } finally {
      setLoading(false);
    }
  }
  
  const handlegetHtml = async (interviewId) => {
    
    try {
      
      const data = await gethtmlforResume(interviewId)
      
      return data.htmlData
    } catch (err) {
      console.error('Error:', err);
      
    }
    
  }
  
  
  
  
  useEffect(() => {
        const getAllReportsAndset = async () => {
            try {
                const data = await getAllInterviewReports();
                setReports(data.reports);

            } catch (err) {
                //console.error('Error:', err);
            } 
        };

        getAllReportsAndset();
    }, []);
  
  
  
  return {Report,loading,setLoading,Reports,handleGenerateInterviewReport,handleGetInterviewById,handleGetAllInterviewReports,handlegetHtml}
}