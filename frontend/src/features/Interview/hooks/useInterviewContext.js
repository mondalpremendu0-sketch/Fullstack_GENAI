import {useContext} from "react";
import {reportData} from '../services/interView.api.js'
import {interViewContext} from '../interView.context.jsx'


export const useInterview = async () => 
{
  const context = useContext(interViewContext);
  const {Report,setReport,loading,setLoading} = context;
  
  const handleInterViewReport = async ({jobDescription,selfDescription,resume})=> 
  {
    try 
    {
      setLoading(true);
      const data = await reportData({jobDescription,selfDescription,resume});
      setReport(data.report);
    } catch (err) 
    {
      //console.error('Error:', err);
    }  finally {
      setLoading(false);
    }

  }
  
}