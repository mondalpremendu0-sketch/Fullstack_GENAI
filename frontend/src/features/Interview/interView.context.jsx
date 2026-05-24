import {createContext,useState} from "react";

export const interViewContext = createContext();

export const interViewProvider = ({children}) => {
  
  const [Report,setReport] = useState(null);
  const [loading,setLoading] = useState(false);
  
  
  return  (
    <interViewContext.Provider value={{Report,setReport,loading,setLoading}} >
      {children}
    </interViewContext.Provider>
    )
}