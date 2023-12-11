import { Navigate, createBrowserRouter } from "react-router-dom";
import Signup from "./views/Signup";
import Users from "./views/Users";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import UserForm from "./views/UserForm";
import { Table } from "flowbite-react";
import Rateds from "./views/Rateds";

const router=createBrowserRouter([


    {
        path: '/',
        element: <DefaultLayout />,
        children:[
            {
                path: '/',
                element: <Navigate to='/users' />
                
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/rateds',
                element: <Rateds/>
              },
            {
                path: '/users/new',
                element: <UserForm key='userCreate' />
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
              }
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },
   
    
    {
        path: '*',
        element: <NotFound />
    },

])
export default router;