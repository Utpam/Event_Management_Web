import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'

function App() {
  return (
    <div className='w-full flex flex-col items-center min-h-screen'>
      <Navbar />
      <div className='mt-24 flex justify-center w-full px-4 max-w-7xl mb-10'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
