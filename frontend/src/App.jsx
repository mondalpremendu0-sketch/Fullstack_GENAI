import { RouterProvider } from "react-router/dom";
import { router } from './app.routes.jsx';
import {AuthProvider} from './features/auth/auth.context.jsx'
import {InterviewProvider} from './features/Interview/interView.context.jsx'

//import './features/Interview/styles/global.scss'
//import ThreeBackground from './Components/Background/ThreeBackground.jsx'


export default function App() {
  return (
    <>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>

    </>

    )
}