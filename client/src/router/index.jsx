import { createBrowserRouter } from "react-router-dom";
import AuthenticatedLayout from "../layout";
import { Home } from "../views/home";
import { Login } from "../views/auth/Login";
import { Signup } from "../views/auth/Signup";
import { FriendsRequests } from "../views/friends_requests";
import { Chat } from "../views/chat";
import { NotFound404 } from "../components/404";

export const router = createBrowserRouter([
    {
        path:"*",
        element:<NotFound404/>
    },
    {
        path: "/",
        element: <AuthenticatedLayout/>,
        children: [
            {
                index:true,
                element: <Home/>
            },
            {
                path: '/friends-requests',
                element: <FriendsRequests/>
            },
            {
                path: '/c/:chatId',
                element: <Chat/>
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