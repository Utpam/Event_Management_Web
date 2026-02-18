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
            setSuccess('Password recovery email sent! Check your inbox.')
            emailRef.current.value = ''
        } catch (err) {
            setError(err.message || 'Failed to send recovery email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-8rem)]">
            <div className="glass-card rounded-2xl p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden border border-red-500">
                {/* Background Glow */}
                <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                <img src={Logo} className="w-24 mb-6 drop-shadow-lg z-10" alt="Logo" />

                <h2 className="text-2xl font-[poppins-sb] text-white mb-2 z-10">Forgot Password?</h2>
                <p className="text-[var(--color-text-muted)] font-[poppins] text-sm mb-6 z-10 text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg w-full mb-4 text-center z-10">{error}</div>}
                {success && <div className="bg-green-500/10 border border-green-500/50 text-green-200 text-sm p-3 rounded-lg w-full mb-4 text-center z-10">{success}</div>}

                <form className="flex flex-col w-full gap-5 z-10" onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="Email" className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Email</label>
                        <input
                            id="Email"
                            placeholder='Enter your email'
                            type="email"
                            ref={emailRef}
                            className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`button w-full py-3 mt-2 text-lg font-bold flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : 'Send Recovery Email'}
                    </button>

                    <div className="flex w-full font-[poppins] justify-center text-sm text-[var(--color-text-muted)] mt-4">
                        Remember your password?
                        <Link to='/login' className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] ml-2 font-[poppins-sb] transition-colors" >Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPass