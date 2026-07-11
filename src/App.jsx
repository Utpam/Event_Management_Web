import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className='w-full flex flex-col items-center min-h-screen' style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className='mt-20 flex justify-center w-full px-4 max-w-7xl mb-10'>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
