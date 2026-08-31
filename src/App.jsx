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
import StudentRegistration from './students/components/StudentRegistration';
import StudentDashboard from './students/components/StudentDashboard';
import StudentProfile from './students/components/StudentProfile';
import StudentResult from './students/components/StudentResult';
import StudentSettings from './students/components/StudentSettings';
import StudentLogin from './students/components/StudentLogin';



const router = createBrowserRouter([

  {
    path:"/",
    element:<StudentRegistration/>
  },

  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path:"/student/login",
    element: <StudentLogin />
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
    path:"/student/result",
    element:<StudentResult/>
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
