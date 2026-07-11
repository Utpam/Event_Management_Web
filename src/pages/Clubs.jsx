import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Search, ArrowRight, Settings } from 'lucide-react'
import dbService from '../../Appwrite/db'
import { useAuth } from '../../AuthContext/UserAuthContext'

function Clubs() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const result = await dbService.getClubs()
        setClubs(result.documents)
      } catch (error) {
        console.error("Failed to fetch clubs", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClubs()
  }, [])

  const isClubAdmin = (clubId) => {
    if (!user || !user.memberships) return false
    const membership = user.memberships.find(m => m.clubId === clubId)
    return membership && (membership.role === 'owner' || membership.role === 'club_admin')
  }

  const getRandomImg = () => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(query.toLowerCase()) ||
    club.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5">
        <div>
          <h1 style={{ fontFamily: 'poppins-sb', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text)', lineHeight: 1.2, marginBottom: '0.35rem' }}>
            Explore Clubs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.9rem' }}>
            Find a community that shares your passion
          </p>
        </div>

        {/* Search */}
        <div
          className="card flex items-center gap-2.5 w-full md:w-72"
          style={{ padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-pill)', flexShrink: 0 }}
        >
          <Search size={14} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a club…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontFamily: 'poppins', fontSize: '0.875rem',
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredClubs.map((club) => (
            <div
              key={club.$id}
              className="card group overflow-hidden"
              style={{ borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              {/* Image */}
              <div className="h-44 overflow-hidden relative">
                <img
                  src={club.img || getRandomImg()}
                  alt={club.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }}
                />
                <h2
                  className="absolute bottom-3 left-4 right-4 truncate"
                  style={{ fontFamily: 'poppins-sb', fontSize: '1.1rem', color: '#fff' }}
                >
                  {club.name}
                </h2>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                <p
                  className="line-clamp-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.8rem', lineHeight: 1.6, minHeight: '2.56rem' }}
                >
                  {club.description}
                </p>

                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link
                    to={`/clubs/${club.$id}`}
                    className="flex items-center gap-1 group/btn"
                    style={{ color: 'var(--accent)', fontFamily: 'poppins-sb', fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    View Details
                    <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>

                  {isClubAdmin(club.$id) && (
                    <Link
                      to={`/clubs/${club.$id}/dashboard`}
                      style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
                      title="Manage club"
                    >
                      <Settings size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredClubs.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)', fontFamily: 'poppins' }}>
          <p>No clubs found{query && ` matching "${query}"`}.</p>
        </div>
      )}
    </div>
  )
}

export default Clubs