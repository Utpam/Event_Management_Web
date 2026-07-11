import React, { useRef, useState } from 'react'
import Logo from '../assets/Logo.png'
import { Link } from 'react-router'
import { authService } from '../../Appwrite/UserAuth'

function ForgotPass() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const email = emailRef.current.value

    if (!email) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    try {
      await authService.recoverPassword(email)
      setSuccess('Recovery email sent! Check your inbox.')
      emailRef.current.value = ''
    } catch (err) {
      setError(err.message || 'Failed to send recovery email')
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
          Forgot password?
        </h1>
        <p
          className="text-center"
          style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', fontFamily: 'poppins' }}
        >
          Enter your email and we&apos;ll send you a reset link.
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

        {success && (
          <div
            className="w-full text-sm text-center rounded-lg mb-4 p-3"
            style={{
              background: 'var(--success-subtle)',
              color: 'var(--success)',
              border: '1px solid var(--success)',
              fontFamily: 'poppins',
            }}
          >
            {success}
          </div>
        )}

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="forgot-email"
              style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            >
              Email
            </label>
            <input
              id="forgot-email"
              placeholder="you@example.com"
              type="email"
              ref={emailRef}
              className="input"
            />
          </div>

          <button
            id="forgot-submit"
            type="submit"
            disabled={loading}
            className="btn w-full"
            style={{ padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.25rem' }}
          >
            {loading ? <span className="spinner" /> : 'Send Reset Link'}
          </button>

          <p
            className="text-center"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'poppins', marginTop: '0.5rem' }}
          >
            Remember your password?{' '}
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

export default ForgotPass