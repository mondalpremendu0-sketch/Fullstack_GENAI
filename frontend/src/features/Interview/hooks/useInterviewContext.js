import {useContext} from "react";
import {generateInterviewReport,getInerviewById,getAllInterviewReport} from '../services/interView.api.js'
import {interviewContext} from '../interView.context.jsx'


export const useInterview = async () => 
{
  const context = useContext(interviewContext);
  const {Report,setReport,loading,setLoading} = context;
  
  const handleGenerateInterviewReport = async ({jobDescription,selfDescription,resume})=> 
  {
    try 
    {
      setLoading(true);
      const data = await generateInterviewReport({jobDescription,selfDescription,resume});
      setReport(data.report);
    } catch (err) 
    {
      //console.error('Error:', err);
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
    } catch (err) {
     // console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }
  
  const handleGetAllInterviewReports = async () => 
  {
    try {
      setLoading(true);
      const data = await getAllInterviewReport();
      setReport(data.reports)
    } catch (err) {
     // console.error('Error:', err);
      
    } finally {
      setLoading(false);
    }
  }
}