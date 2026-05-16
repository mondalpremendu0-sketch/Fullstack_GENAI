import {useContext} from "react";
import {AuthContext} from '../auth.context.jsx';
import {login,register,logout,getMe} from '../services/auth.api.js'



export const useAuth = () => {
  const context = useContext(AuthContext);
  const {user,setUser,loading,setLoading} = context;
  
  const handleRegister = async ({firstname,lastname,email,password}) => {
    
    try {
      setLoading(true);
      const data = await register({firstname,lastname,email,password});
    //console.log("data",data);
      setUser(data.user);
      //console.log("user",user);
    } catch (err) {
     // console.error('Error:', err);
    } finally {
    setLoading(false);
    }
  }
  
  const handleLogin = async ({email,password}) => {
    
    try {
      setLoading(true);
      const data = await login({email,password});
      console.log(data);
      setUser(data.user);
      console.log(user);
      
    } catch (err) {
      //console.error('Error:', err);
      
    }finally {
    setLoading(false);
    }
  }
  
  const handlegetMe = async () => {
    
    try {
      setLoading(true);
      const data = await getMe();
      setUser(data.user);
      
    } catch (err) {
      //console.error('Error:', err);
      
    }finally{
       setLoading(false);
    }
  }
  
  const handleLogout = async () => {
    
    try {
      setLoading(true);
      const data = await logout();
      setUser(null);
      
    } catch (err) {
      //console.error('Error:', err);
      
    } finally {
      setLoading(false);
    }
  }
  
  return {user,loading,handleRegister,handleLogin,handleLogout,handlegetMe}

}