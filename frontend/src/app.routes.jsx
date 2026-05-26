import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import HomePage from "./features/Interview/pages/Home.jsx";
import InterViewPage from "./features/Interview/pages/interview.jsx";
import Proceted from "./features/auth/components/Protected.jsx";

const router = createBrowserRouter([
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
        path: "/",
        element: (
            <Proceted>
                <HomePage />
            </Proceted>
        )
    },
    {
        path: "/report/:interviewId",
        element: (
            <Proceted>
                <InterViewPage />
            </Proceted>
        )
    }
]);

export { router };
