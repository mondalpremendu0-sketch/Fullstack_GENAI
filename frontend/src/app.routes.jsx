import { createBrowserRouter } from "react-router";
import Register from './features/auth/pages/Register.jsx'
import Login from './features/auth/pages/Login.jsx'
import Home from './features/Home/Home.jsx'
import Proceted from './features/auth/components/Protected.jsx'



const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Proceted><Home /> </Proceted>},
]);

export {router}