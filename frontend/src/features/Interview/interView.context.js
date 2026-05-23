const {createContext,useState} = require("react");

export const interViewContext = createContext();

export const interViewProvider = ({children}) => {
  
  return  (
    <interViewContext.Provider value={{}} >
      {children}
    </interViewContext.Provider>
    )
}