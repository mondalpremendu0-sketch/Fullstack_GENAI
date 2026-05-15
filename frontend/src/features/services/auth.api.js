import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:3000/api/',
  withCredentials:true
});

export const register = async ({firstname,lastname,email, password}) => {
  try {
    const response = await api.post("auth/register",{
    firstname,lastname,email, password
  })
  return response.data;
  } catch (err) {
    console.error('Error:', err);
    
  }
  
  
}
export const login = async ({email, password}) => {
  try {
    const response = await api.post("auth/login",{
    email, password
  })
  return response.data;
  } catch (err) {
    console.error('Error:', err);
    
  }
  
}
export const getMe = async () => {
  try {
    const response = await api.get("auth/getMe");
    return response.data;
  } catch (err) {
    console.error('Error:', err);
    
  }
  
}
export const logout = async () => {
  try {
    const response = await api.get("auth/logout")
    return response.data;
    
  } catch (err) {
    console.error('Error:', err);
    
  }
  
}