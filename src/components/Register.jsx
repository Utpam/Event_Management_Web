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
                // Auto login after registration
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
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-8rem)]">
            <div className="glass-card rounded-2xl p-8 w-full max-w-lg flex flex-col items-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                <img src={Logo} className="w-24 mb-6 drop-shadow-lg z-10" alt="Logo" />

                <h2 className="text-2xl font-[poppins-sb] text-white mb-2 z-10">Create Account</h2>
                <p className="text-[var(--color-text-muted)] font-[poppins] text-sm mb-6 z-10 text-center">
                    Join us and start your journey
                </p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg w-full mb-4 text-center z-10">{error}</div>}

                <form className="flex flex-col w-full gap-5 z-10" onSubmit={handleSubmit}>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="Name" className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Name</label>
                        <input
                            id="Name"
                            placeholder='Enter your full name'
                            type="text"
                            ref={(el) => inputRef.current.name = el}
                            className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="Email" className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Email</label>
                        <input
                            id="Email"
                            placeholder='Enter your email'
                            type="email"
                            ref={(el) => inputRef.current.email = el}
                            className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="Password" className="font-[poppins-sb] text-sm text-[var(--color-text-muted)] ml-1">Password</label>
                        <div className="relative">
                            <input
                                id="Password"
                                placeholder='Create a password'
                                type={showpass ? 'text' : 'password'}
                                ref={(el) => inputRef.current.password = el}
                                className="bg-slate-800/50 border border-slate-700 focus:border-[var(--color-primary)] text-white text-sm p-3 rounded-xl font-[poppins-lt] outline-none transition-all w-full placeholder:text-slate-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowpass(!showpass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-[poppins]"
                            >
                                {showpass ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`button w-full py-3 mt-2 text-lg font-bold flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : 'Sign Up'}
                    </button>

                    <div className="flex w-full font-[poppins] justify-center text-sm text-[var(--color-text-muted)] mt-4">
                        Already have an account?
                        <Link to='/login' className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] ml-2 font-[poppins-sb] transition-colors" >Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
