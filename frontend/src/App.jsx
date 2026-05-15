import { RouterProvider } from "react-router/dom";
import { router } from './app.routes.jsx';

//import ThreeBackground from './Components/Background/ThreeBackground.jsx'


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>

    )
}