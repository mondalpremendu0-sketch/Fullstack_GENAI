import { createContext,useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loding,setLoading] = useState(false);
  
  
  return(
    <AuthContext.Provider value={{user,setUser,loding,setLoading}} >
      {children}
    </AuthContext.Provider>
    )
}