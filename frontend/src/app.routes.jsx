import { createBrowserRouter } from "react-router";
import Register from './Components/auth/Register/Register.jsx'
import Login from './Components/auth/Login/Login.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

export {router}