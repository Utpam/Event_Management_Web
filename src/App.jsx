import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'
import {useAuth} from '../AuthContext/UserAuthContext'

function App() {
  // const [userD, setUserD] = useState('Utpam')
  // const {user, authStatus, login, logout} = useAuth()

  // const LoginHandler = () => {
  //   console.log("Clicked !")
  //   if(!user) {
  //     login(userD)
  //   }
  //   else{
  //     logout()
  //   }
  // }
  return (
    <div className='h-screen w-full flex flex-col items-center'>
      <Navbar />
      <div className='mt-4 flex justify-center w-[90%]'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
