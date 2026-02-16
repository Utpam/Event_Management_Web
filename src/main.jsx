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
        path: '/clubs',
        element: 
        <AuthLayout authentication>
          {" "}
          <Clubs />
        </AuthLayout>
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
