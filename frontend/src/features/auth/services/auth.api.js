import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials:true
});

export const register = async ({firstname,lastname,email, password}) => {
  try {
    const response = await api.post("/api/auth/register",{
    firstname,lastname,email, password
  })
  //console.log(response);
  return response.data;
  } catch (err) {
    console.error('reg-Error:', err);
    
  }
  
  
}
export const login = async ({email, password}) => {
  try {
    const response = await api.post("/api/auth/login",{
    email, password
  })
  return response.data;
  } catch (err) {
    console.error('Error:', err.response.data);
    
  }
  
}
export const getMe = async () => {
  try {
    const response = await api.get("/api/auth/getMe");
    return response.data;
  } catch (err) {
    console.error('Error:', err);
    
  }
  
}
export const logout = async () => {
  try {
    const response = await api.get("/api/auth/logout")
    return response.data;
    
  } catch (err) {
    console.error('Error:', err);
    
  }
  
}