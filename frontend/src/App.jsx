import { RouterProvider } from "react-router/dom";
import { router } from './app.routes.jsx';
import {AuthProvider} from './features/auth/auth.context.jsx'
//import ThreeBackground from './Components/Background/ThreeBackground.jsx'


export default function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

    </>

    )
}