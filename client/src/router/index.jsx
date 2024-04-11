import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpForm from "../components/auth/SignUpForm";
import AuthenticatedLayout from "../layout";
import { Home } from "../views/home";
import { Login } from "../views/auth/Login";
import { Signup } from "../views/auth/Signup";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthenticatedLayout/>,
        children: [
            {
                index:true,
                element: <Home/>
            }
        ]
    },
    {
        path:'/login',
        element: <Login/>,
    },
    {
        path:'/signup',
        element: <Signup/>
    }
])