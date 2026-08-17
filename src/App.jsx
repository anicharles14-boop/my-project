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
import StudentSignup from './students/components/StudentSignup';
import StudentDashboard from './students/components/StudentDashboard';
import StudentProfile from './students/components/StudentProfile';
import StudentSettings from './students/components/StudentSettings';



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
    path: "/student/signup",
    element: <StudentSignup />
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />
  },
  {
    path: "/student/profile",
    element: <StudentProfile />
  },
  {
    path: "/student/settings",
    element: <StudentSettings />
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
