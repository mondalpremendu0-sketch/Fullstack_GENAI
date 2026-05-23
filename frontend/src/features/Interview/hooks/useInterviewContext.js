const {useContext} = require("react");
const {reportData} = require('../services/interView.api.js')
const {interViewContext} = require('../interView.context.js')


export const useInterview = async () => 
{
  const context = useContext(interViewContext);
  const {report,setReport,loading,setLoading} = context;
  
  const handleInterViewReport = async ({})=> 
  {
    try 
    {
      setLoading(true);
      const data = await reportData({});
      setReport(data.report);
    } catch (err) 
    {
      //console.error('Error:', err);
    }  finally {
      setLoading(false);
    }

  }
  
}