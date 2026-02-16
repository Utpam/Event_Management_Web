import React, { useMemo, useState } from 'react'
import HomeList from '../components/HomeList'
import OpenedComponent from '../components/OpenedComponent'
import Modal from '../components/modalPortal'
import { useAuth } from '../../AuthContext/UserAuthContext'
import Login from '../components/Login'
import search from '../assets/search.png'
function Home() {
  const { authStatus, isLoading } = useAuth()

  const [events] = useState([
    {
      id: 1,
      title: 'IEEE Techithon',
      location: 'Malad, Mumbai',
      reg: '2026-01-15',
      start: '2026-01-15',
      end: '2026-01-15',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOtDaTtvC7sNNai0NeninDNfR21zIFgtObdw&s'
    },
    { id: 2, title: 'IEEE', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 3, title: 'IEEE Workshop', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'atharva', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'something Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
  ])

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  const filtered = useMemo(() => {
    if (!query) return events
    const q = query.toLowerCase()
    return events.filter(
      (e) => e.title.toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q)
    )
  }, [events, query])

  const openEvent = (evt) => {
    setSelected(evt)
    setShowPopup(true)
  }

  const closeModal = () => {
    setShowPopup(false)
    setSelected(null)
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!authStatus) return <Login />

  return (
    <div className="w-full py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-[poppins-sb]">Upcoming Events</h1>
        <div className="flex items-center gap-2 border p-2 bg-white text-black rounded-md">
          <img src={search} className='w-6 px-1'/>
          <input
            aria-label="Search events"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title"
            className=" py-2 w-auto outline-none overflow-x-auto"
          />
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((evt) => (
          <div
            key={evt.id}
            onClick={() => openEvent(evt)}
            className="bg-white text-black hover:scale-[102%] transition-all cursor-pointer rounded-lg overflow-hidden"
          >
            <HomeList {...evt} />
          </div>
        ))}
      </main>

      {showPopup && selected && (
        <Modal open={showPopup} onClose={closeModal}>
          <OpenedComponent {...selected} />
        </Modal>
      )}
    </div>
  )
}

export default Home