import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import logo from '../assets/Logo.png'
import { useAuth } from '../../AuthContext/UserAuthContext'
import { authService } from '../../Appwrite/UserAuth'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Menu, X } from 'lucide-react'

function Navbar() {
  const { logout, authStatus, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const Logout = async () => {
    try {
      logout()
      await authService.authlogout()
      setMobileMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout Error: ', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
  ]

  if (authStatus) {
    if (user?.globalRole === 'global_admin') {
      navLinks.push({ name: 'Admin', path: '/admin' })
    }
    navLinks.push({ name: 'Dashboard', path: '/dashboard' })
  }

  return (
    <>
      <nav
        style={{
          background: isScrolled ? 'var(--surface)' : 'var(--bg)',
          borderBottom: `1px solid ${isScrolled ? 'var(--border)' : 'transparent'}`,
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-9 w-auto logo-adaptive"
            />
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-[poppins] transition-all duration-200 ${
                    isActive
                      ? 'text-[var(--accent)] bg-[var(--accent-subtle)] font-[poppins-sb]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-alt)]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[var(--bg-alt)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]"
            >
              {theme === 'dark'
                ? <Sun size={16} strokeWidth={1.8} />
                : <Moon size={16} strokeWidth={1.8} />
              }
            </button>

            {authStatus ? (
              <button onClick={Logout} className="btn" style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}>
                Sign Out
              </button>
            ) : (
              <NavLink to="/login" className="btn" style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}>
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile — theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 text-[var(--text-muted)] hover:bg-[var(--bg-alt)]"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-alt)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{ background: 'var(--bg)' }}
        className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-6 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-2xl font-[poppins-sb] transition-colors duration-200 ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}

        {authStatus ? (
          <button onClick={Logout} className="btn mt-4" style={{ fontSize: '1rem', padding: '0.65rem 2rem' }}>
            Sign Out
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="btn mt-4"
            style={{ fontSize: '1rem', padding: '0.65rem 2rem' }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </>
  )
}

export default Navbar