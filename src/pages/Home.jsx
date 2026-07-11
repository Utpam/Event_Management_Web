import React, { useMemo, useState } from 'react'
import HomeList from '../components/HomeList'
import OpenedComponent from '../components/OpenedComponent'
import Modal from '../components/ModalPortal'
import { useAuth } from '../../AuthContext/UserAuthContext'
import Login from '../components/Login'
import { Search } from 'lucide-react'

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
    { id: 2, title: 'IEEE Summit', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 3, title: 'IEEE Workshop', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 4, title: 'Student Meet', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 5, title: 'Design Bootcamp', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 6, title: 'Open Mic Night', location: 'Atharva', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 7, title: 'Hackathon 2026', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 8, title: 'Startup Pitch', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 9, title: 'Cloud Conference', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 10, title: 'AI & ML Summit', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 11, title: 'Robotics Expo', location: 'Malad', reg: '2026-01-15', start: '2026-01-15', end: '2026-01-15' },
    { id: 12, title: 'Cultural Fest', location: 'Malad' },
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

  const openEvent = (evt) => { setSelected(evt); setShowPopup(true) }
  const closeModal = () => { setShowPopup(false); setSelected(null) }

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  )
  if (!authStatus) return <Login />

  return (
    <div className="w-full pb-10">

      {/* Hero Section */}
      <section
        className="relative w-full rounded-2xl overflow-hidden mb-10"
        style={{
          minHeight: '240px',
          background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-alt) 100%)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <h1
            className="mb-3"
            style={{ fontFamily: 'poppins-sb', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)', lineHeight: 1.2 }}
          >
            Discover Amazing Events
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Find and join the best workshops, meetups, and conferences happening around you.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div
        className="sticky top-20 z-30 mb-8 mx-auto"
        style={{ maxWidth: '560px' }}
      >
        <div
          className="card flex items-center gap-3"
          style={{ padding: '0.5rem 0.75rem 0.5rem 1rem', borderRadius: '9999px' }}
        >
          <Search size={16} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
          <input
            aria-label="Search events"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by title or location…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: 'poppins', fontSize: '0.9rem',
            }}
          />
        </div>
      </div>

      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="section-title">Upcoming Events</h2>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.8rem' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length > 0 ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              onClick={() => openEvent(evt)}
              className="card cursor-pointer group overflow-hidden"
              style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderRadius: 'var(--radius-lg)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              <HomeList {...evt} />
            </div>
          ))}
        </main>
      ) : (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)', fontFamily: 'poppins' }}>
          <p>No events found matching &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {showPopup && selected && (
        <Modal open={showPopup} onClose={closeModal} maxWidth="max-w-3xl">
          <OpenedComponent {...selected} />
        </Modal>
      )}
    </div>
  )
}

export default Home