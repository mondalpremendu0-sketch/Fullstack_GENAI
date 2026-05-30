import { createBrowserRouter } from "react-router";
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import HomePage from "./features/Interview/pages/Home.jsx";
import InterViewPage from "./features/Interview/pages/interview.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import NotFoundPage from "./features/Interview/pages/NotFound.jsx";

const router = createBrowserRouter([
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    {
        element: <Protected />, // The bouncer stands at the door here
        children: [
            {
                path: "/",
                element: <HomePage /> // The Outlet renders this!
            },
            // You can add as many private routes as you want here
            // { path: "/settings", element: <Settings /> },
            {
                path: "/report/:interviewId",
                element: <InterViewPage />
            }
        ]
    },

    { path: "*", element: <NotFoundPage /> }
]);

export { router };
