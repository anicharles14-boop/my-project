import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Student from './components/Students';
import Evaluation from './components/Evaluation';
import Report from './components/Report';
import Setting from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';



const router = createBrowserRouter([

  {
    path:"/",
    element:<Login/>
  },

  {
    path:"/signup",
    element:<Signup/>
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path:"/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/student",
        element:<Student/>
      },
      {
        path:"/evaluation",
        element:<Evaluation/>
      },
      {
        path:"/report",
        element:<Report/>
      },
      {
        path:"/setting",
        element:<Setting/>
      }
    ]

  }

  
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
      
    </>
    
  )

}

export default App
