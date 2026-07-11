import React, { useRef, useState } from 'react'
import Logo from '../assets/Logo.png'
import { Link, useNavigate } from 'react-router'
import { authService } from '../../Appwrite/UserAuth'
import { useAuth } from "../../AuthContext/UserAuthContext"

function Register() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showpass, setShowpass] = useState(false)
  const inputRef = useRef({})
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const name = inputRef.current.name?.value
    const email = inputRef.current.email?.value
    const password = inputRef.current.password?.value

    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const account = await authService.createAccount(email, password, name)
      if (account) {
        const session = await authService.authlogin(email, password)
        if (session) {
          const userData = await authService.getCurrentUser()
          if (userData) {
            login(userData)
            navigate('/')
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Registration Failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-5rem)]">
      <div
        className="card w-full max-w-md flex flex-col items-center"
        style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-md)' }}
      >
        <img src={Logo} className="h-12 mb-6 logo-adaptive" alt="Logo" />

        <h1
          className="text-2xl mb-1"
          style={{ fontFamily: 'poppins-sb', color: 'var(--text)' }}
        >
          Create account
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', fontFamily: 'poppins' }}>
          Join and start discovering events
        </p>

        {error && (
          <div
            className="w-full text-sm text-center rounded-lg mb-4 p-3"
            style={{
              background: 'var(--danger-subtle)',
              color: 'var(--danger)',
              border: '1px solid var(--danger)',
              fontFamily: 'poppins',
            }}
          >
            {error}
          </div>
        )}

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-name"
              style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Full Name
            </label>
            <input
              id="reg-name"
              placeholder="John Doe"
              type="text"
              ref={(el) => (inputRef.current.name = el)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-email"
              style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Email
            </label>
            <input
              id="reg-email"
              placeholder="you@example.com"
              type="email"
              ref={(el) => (inputRef.current.email = el)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reg-password"
              style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                placeholder="••••••••"
                type={showpass ? 'text' : 'password'}
                ref={(el) => (inputRef.current.password = el)}
                className="input"
                style={{ paddingRight: '3.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowpass(!showpass)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-subtle)', fontSize: '0.75rem', fontFamily: 'poppins',
                }}
              >
                {showpass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn w-full"
            style={{ padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.25rem' }}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>

          <p
            className="text-center"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'poppins', marginTop: '0.5rem' }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--accent)', fontFamily: 'poppins-sb', textDecoration: 'none' }}
              className="hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
