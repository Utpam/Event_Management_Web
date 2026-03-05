import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from '../AuthContext/UserAuthContext.jsx'
// Pages
import Home from './pages/Home.jsx'
import LoginPG from './pages/Login.jsx'
import AuthLayout from './components/AuthLayout.jsx'
import Clubs from './pages/Clubs.jsx'
import ForgetPass from './pages/forgetpass.jsx'
import RegisterPG from './pages/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GlobalDashboard from './components/Admin/GlobalDashboard.jsx'
import ClubDashboard from './components/Club/ClubDashboard.jsx'
import UserDashboard from './components/User/UserDashboard.jsx'
import AddPost from './pages/AddPost.jsx'
import ClubDetails from './pages/ClubDetails.jsx'
const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '',
        element:
          <AuthLayout authentication={false}>
            <Home />
          </AuthLayout>
      },
      {
        path: '/login',
        element:
          <AuthLayout authentication={false}>
            <LoginPG />
          </AuthLayout>
      },
      {
        path: '/register',
        element:
          <AuthLayout authentication={false}>
            <RegisterPG />
          </AuthLayout>
      },
      {
        path: '/clubs',
        element:
          <AuthLayout authentication>
            {" "}
            <Clubs />
          </AuthLayout>
      },
      {
        path: '/forget-pass',
        element:
          <AuthLayout authentication={false}>
            <ForgetPass />
          </AuthLayout>
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['global_admin']}>
            <GlobalDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/clubs/:id/dashboard',
        element: (
          <ProtectedRoute requireClubRole={['club_admin', 'owner', 'admin']}>
            <ClubDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/clubs/:id',
        element: (
          <ProtectedRoute>
            <ClubDetails />
          </ProtectedRoute>
        )
      },
      {
        path: '/clubs/:id/add-post',
        element: (
          <ProtectedRoute requireClubRole={['club_admin', 'owner', 'admin', 'member']}>
            <AddPost />
          </ProtectedRoute>
        )
      },
      // {
      //   path: '',
      //   element:
      // },
      // {
      //   path: '',
      //   element:
      // },
      // {
      //   path: '',
      //   element:
      // },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
