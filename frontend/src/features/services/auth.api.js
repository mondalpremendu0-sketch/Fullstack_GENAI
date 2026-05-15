import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:3000/api/',
  withCredentials:true
});

export const register = async ({firstname,lastname,email, password}) => {
  const data = await api.post("auth/register",{
    firstname,lastname,email, password
  })
}
export const login = async ({email, password}) => {
  const data = await api.post("auth/login",{
    email, password
  })
}
export const getMe = async () => {
  const data = await api.get("auth/getMe",{
    
  })
}
export const logout = async () => {
  const data = await api.get("auth/logout",{
    
  })
}