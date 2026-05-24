import {createContext,useState} from "react";

export const interviewContext = createContext();

export const InterviewProvider = ({children}) => {
  
  const [Report,setReport] = useState(null);
  const [Reports,setReports] = useState([]);
  const [loading,setLoading] = useState(false);
  
  
  return  (
    <interviewContext.Provider value={{Report,setReport,loading,setLoading,Reports,setReports}} >
      {children}
    </interviewContext.Provider>
    );
}