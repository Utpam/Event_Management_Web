import { useEffect, useRef, useState } from "react"
import {authService} from '../../Appwrite/UserAuth'
import { useAuth } from "../../AuthContext/UserAuthContext"
import Logo from '../assets/Logo.png'
import { Link, useNavigate } from "react-router"

function Login() {
    const [error, setError] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    const inputRef = useRef([])
    const navigate = useNavigate()
    const {user, authStatus, login, logout} = useAuth()
    const [showpass, setShowpass] = useState(false)

    useEffect(() => {
        if(inputRef.current.email){
            inputRef.current.email.focus()
        }
    })
    
      const LoginHandler = async (e) => {
        e.preventDefault();
        setError("")
        // console.log(inputRef.current['username'].value);

        const email = inputRef.current.email?.value
        const password = inputRef.current.password?.value
        
        if(!email && !password){
            setError('Enter a valid Input')
            return
        }
        try {
            const session = await authService.authlogin(email, password)
                if(session) {
                    const userData = await authService.getCurrentUser()
                    if(userData) {
                        login(userData);
                        navigate('/')
                    }
                }
                // setError()

        } catch (err) {
            setError(err.message || 'Login Failed !')
            console.log('Catch block')
            console.error(err)
        }
      }
  return (
    <div>
    <div className="bg-[#0000FF] shadow-og rounded-lg w-[325px] p-5 flex flex-col items-center m-2">
        <img src={Logo} className="w-[70%]"/>
        {error && <p className="text-red-400 mt-2">{error}</p>}
        <hr className="border rounded-lg w-full mt-2" />
        <form className="flex flex-col w-full gap-2" onSubmit={LoginHandler}>

            <section className="mt-2">
                <label htmlFor="Email" className="font-[poppins-sb]">Email</label>
                <input placeholder='Enter email' type="email" ref={(val) => inputRef.current['email'] = val} className="bg-white text-[1em] text-black p-2 w-full rounded-lg font-[poppins-lt] inline focus:outline-none" />
            </section>

            <section>
                <label htmlFor="Password" className="font-[poppins-sb]">Password</label>
                <input placeholder='Enter password' type={showpass ? 'text': 'password'} ref={(val) => inputRef.current['password'] = val} className="bg-white text-[1em] text-black w-full p-2 rounded-lg font-[poppins-lt] focus:outline-none" />
            </section>

            <div className="flex w-full justify-between">
                <div className="ml-2 flex gap-1 ">
                    <input type="checkbox"checked={showpass} onChange={() => setShowpass(!showpass)} className="cursor-pointer" />
                    <label htmlFor="Password" className="font-[poppins-lt] text-[0.8em] cursor-pointer" onClick={() => setShowpass(!showpass)}>show Password</label>
                </div>
                <Link to='/forget-pass' className="hover:text-gray-400 hover:underline w-fit font-[poppins-lt]  text-[0.8rem]" >forget?</Link>
            </div>

            <button
                type="submit"
                className='bg-black text-white p-2 rounded-md font-[poppins-sb] text-2xl  hover:bg-gray-900 cursor-pointer'
            >
             Login
            </button>

            {/* <hr className="border border-black rounded-lg w-full" /> */}
            <div className="flex w-full font-[poppins-lt]  justify-center text-[0.8rem]">
                No account?
                <Link to='/register' className="hover:text-gray-400 hover:underline w-fit  text-[0.8rem]" >Register</Link>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Login