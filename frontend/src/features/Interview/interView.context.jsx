import {createContext,useState,useEffect} from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({children}) => {
  
  const [Report,setReport] = useState(null);
  const [Reports,setReports] = useState([]);
  const [loading,setLoading] = useState(false);
  
  const [globalError,setGlobalError] = useState(null);
  
  
  
  
  
  return  (
    <InterviewContext.Provider value={{Report,setReport,loading,setLoading,Reports,setReports,globalError,setGlobalError}} >
      {children}
    </InterviewContext.Provider>
    );
}