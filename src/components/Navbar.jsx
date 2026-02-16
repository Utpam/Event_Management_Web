import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import logo from '../assets/Logo.png'
import Sidebar from './Sidebar';
import { useAuth } from '../../AuthContext/UserAuthContext';
import {authService} from '../../Appwrite/UserAuth'

function Navbar() {
  const {logout, authStatus} = useAuth()
  const [onMob, setOnMob] = useState(window.innerWidth < 550);

  const Logout = async () => {
    try {
      logout()
      authService.authlogout()
    } catch (error) {
      console.error('Logout Error: ', error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setOnMob(window.innerWidth < 550);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const linkClass = ({isActive}) => (`
    self-center-safe
    ${onMob ? 'hidden' : ''}
    ${isActive ? "text-white" : "text-white/70"}
  `) 



  return (
    <>
    <div className='flex justify-between h-[4em]  w-full  p-[10px] font-[Mukta] bg-[#0000FF]'>
        <section className='h-[50px] '>
          <NavLink to='/home' className='w-fit '> 
            
              <img src={logo} className='h-[3em]'/>
            
          </NavLink>
        </section>
        
        <section className={`flex  gap-[3rem] text-[20px] `}>
            <NavLink to='/' className={linkClass}>HOME</NavLink>
            <NavLink to='/clubs' className={linkClass}>CLUBS</NavLink>
            {
              authStatus === true &&
              <button 
              onClick={() => Logout()} 
              className='cursor-pointer self-center'>
                Logout
            </button>
            }
            <button 
              onClick={() => console.log('clicked')} 
              className='cursor-pointer rounded-full h-[42px] aspect-square border-2 self-center'>
              {/* <img src={} /> */}
            </button>
        </section>
    </div>
    </>
  )
}

export default Navbar