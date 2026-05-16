import {Navigate} from "react-router"
import {useAuth} from '../hooks/useAuthContext.js'
import InfiniteLoader from './InfiniteLoader.jsx'
export default function Protected({children}) {
 
  const {loading,user} = useAuth();
  if (loading) {
    return(<InfiniteLoader />)
  }
  
  if (!user) {
    return (
      <Navigate to={"/login"} />
      )
  }
  
  return children;
  
}