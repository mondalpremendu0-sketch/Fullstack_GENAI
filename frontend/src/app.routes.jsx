import { createBrowserRouter } from "react-router";
import Register from './features/auth/pages/Register.jsx'
import Login from './features/auth/pages/Login.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

export {router}