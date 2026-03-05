import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import logo from '../assets/Logo.png'
import { useAuth } from '../../AuthContext/UserAuthContext';
import { authService } from '../../Appwrite/UserAuth'

function Navbar() {
  const { logout, authStatus, user } = useAuth()
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const Logout = async () => {
    try {
      logout()
      await authService.authlogout()
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout Error: ', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
  ];

  if (authStatus) {
    if (user?.globalRole === 'global_admin') {
      navLinks.push({ name: 'Admin', path: '/admin' });
    }
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-2' : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/  " className="flex items-center gap-2 group">
          <img src={logo} alt="Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          {/* <span className="text-xl font-[poppins-sb] tracking-wide text-white">EventM</span> */}
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-[poppins] tracking-wide transition-colors duration-300 hover:text-[var(--color-secondary)] ${isActive ? 'text-[var(--color-secondary)]' : 'text-slate-300'
                }`
              }
            >
              {link.name.toUpperCase()}
            </NavLink>
          ))}

          {authStatus ? (
            <button
              onClick={Logout}
              className="button text-sm"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="button text-sm">
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-40 transform transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-2xl font-[poppins-sb] tracking-wider transition-colors duration-300 ${isActive ? 'text-[var(--color-secondary)]' : 'text-slate-300'
              }`
            }
          >
            {link.name.toUpperCase()}
          </NavLink>
        ))}

        {authStatus ? (
          <button
            onClick={Logout}
            className="button text-lg px-8 py-3"
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="button text-lg px-8 py-3">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar