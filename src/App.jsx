import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Student from './components/Students';
import Evaluation from './components/Evaluation';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import Terms from './components/Terms';
import StudentRegistration from './students/components/StudentRegistration';
import StudentDashboard from './students/components/StudentDashboard';
import StudentProfile from './students/components/StudentProfile';
import StudentResult from './students/components/StudentResult';
import StudentLogin from './students/components/StudentLogin';
import { adminAuth, studentAuth } from './config/firebase';



// Resets the scroll position to the top on every navigation
// (and restores it when going back/forward).
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        // Old address for the landing page, kept so existing links still work
        path: "/landing",
        element: <Landing />
      },
      {
        path: "/admin/signup",
        element: <Signup />
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
        path: "/student/registration",
        element: <StudentRegistration />
      },
      {
        element: <ProtectedRoute authInstance={studentAuth} redirectTo="/student/login" recordCollection="students" />,
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
        path: "/terms",
        element: <Terms />
      },
      {
        element: <ProtectedRoute authInstance={adminAuth} redirectTo="/admin/login" recordCollection="admins" />,
        children: [
          {
            path: "/admin/dashboard",
            element: <Dashboard />
          },
          {
            path: "/admin/student",
            element: <Student />
          },
          {
            path: "/admin/evaluation",
            element: <Evaluation />
          }
        ]
      },
      {
        // Any address that doesn't match a page above
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
      
    </>
    
  )

}

export default App
