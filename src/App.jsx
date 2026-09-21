import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Student from './components/Students';
import Evaluation from './components/Evaluation';
import Setting from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import StudentRegistration from './students/components/StudentRegistration';
import StudentDashboard from './students/components/StudentDashboard';
import StudentProfile from './students/components/StudentProfile';
import StudentResult from './students/components/StudentResult';
import StudentSettings from './students/components/StudentSettings';
import StudentLogin from './students/components/StudentLogin';
import { adminAuth, studentAuth } from './config/firebase';



const router = createBrowserRouter([

  {
    path:"/",
    element:<StudentLogin/>
  },

  {
    path:"/admin/signup",
    element:<Signup/>
  },
  {
    path: "/admin/login",
    element: <Login />
  },
  {
    path: "/student/login",
    element: <StudentLogin />
  },
  {
    path:"/student/registration",
    element: <StudentRegistration />
  },

  {
    element: <ProtectedRoute authInstance={studentAuth} redirectTo="/" />,
    children: [
      {
        path: "/student/dashboard",
        element: <StudentDashboard />
      },
      {
        path: "/student/profile",
        element: <StudentProfile />
      },
      {
        path: "/student/result",
        element: <StudentResult />
      }
    ]
  },
  {
    path: "/student/settings",
    element: <StudentSettings />
  },
  {
    element: <ProtectedRoute authInstance={adminAuth} redirectTo="/admin/login" />,
    children: [
      {
        path:"/admin/dashboard",
        element:<Dashboard/>
      },
      {
        path:"/admin/student",
        element:<Student/>
      },
      {
        path:"/admin/evaluation",
        element:<Evaluation/>
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
