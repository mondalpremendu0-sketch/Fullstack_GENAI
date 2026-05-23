const {createContext,useState} = require("react");

export const interViewContext = createContext();

export const interViewProvider = ({children}) => {
  
  const [report,setReport] = useState({});
  const [loading,setLoading] = useState(false);
  
  
  return  (
    <interViewContext.Provider value={{report,setReport,loading,setLoading}} >
      {children}
    </interViewContext.Provider>
    )
}