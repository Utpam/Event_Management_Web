import React, { useMemo, useState } from 'react'
import HomeList from '../components/HomeList'
import OpenedComponent from '../components/OpenedComponent'
import Modal from '../components/modalPortal'
import { useAuth } from '../../AuthContext/UserAuthContext'
import Login from '../components/Login'
import searchIcon from '../assets/search.png'

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
    { id: 5, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 6, title: 'Student Meet', location: 'atharva', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 7, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 8, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 9, title: 'something Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 10, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 11, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 12, title: 'Student Meet', location: 'Malad'},
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

  if (isLoading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>
  if (!authStatus) return <Login />

  return (
    <div className="w-full pb-10">

      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden mb-12 min-h-[300px] flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40 blur-[2px]"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-[poppins-sb] text-white mb-4 drop-shadow-md">Discover Amazing Events</h1>
          <p className="text-lg text-white/90 font-[poppins-lt] max-w-2xl mx-auto">Find and join the best workshops, meetups, and conferences happening around you.</p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="sticky top-24 z-30 mb-8 glass-card rounded-full p-2 flex items-center max-w-2xl mx-auto transition-all focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        <div className="p-3 bg-[var(--color-primary)] rounded-full text-white">
          <img src={searchIcon} className='w-5 h-5 invert brightness-0 filter' />
        </div>
        <input
          aria-label="Search events"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by title or location..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-400 px-4 font-[poppins] text-lg"
        />
      </div>

      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-[poppins-sb] text-white border-l-4 border-[var(--color-secondary)] pl-3">Upcoming Events</h2>
        <span className="text-[var(--color-text-muted)] text-sm font-[poppins]">{filtered.length} events found</span>
      </header>

      {filtered.length > 0 ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              onClick={() => openEvent(evt)}
              className="glass-card hover:bg-white/5 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-1"
            >
              <HomeList {...evt} />
            </div>
          ))}
        </main>
      ) : (
        <div className="text-center py-20 text-[var(--color-text-muted)] font-[poppins]">
          <p className="text-xl">No events found matching "{query}"</p>
        </div>
      )}

      {showPopup && selected && (
        <Modal open={showPopup} onClose={closeModal}>
          <OpenedComponent {...selected} />
        </Modal>
      )}
    </div>
  )
}

export default Home