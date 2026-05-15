import {useContext} from "react";
import {AuthContext} from '../auth.context.jsx';
import {register,login,getMe,logout} from '../services/auth.api.js'



export const useAuth = () => {
  const context = useContext(AuthContext);
  const {user,setUser,loading,setLoading} = context;
  
  const handleRegister = async ({firstname,lastname,email,password}) => {

    setLoading(true);
    const data = await register({firstname,lastname,email,password});
    setUser(data.user);
    setLoading(false);
  }
  
  const handleLogin = async ({email,password}) => {

    setLoading(true);
    const data = await login({email,password});
    setUser(data.user);
    setLoading(false);
  }
  
  const handlegetMe = async () => {

    setLoading(true);
    const data = await getMe();
    setUser(data.user);
    setLoading(false);
  }
  
  const handleLogout = async () => {

    setLoading(true);
    const data = await logout();
    setUser(null);
    setLoading(false);
  }

}