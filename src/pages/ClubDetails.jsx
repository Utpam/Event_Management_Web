import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import dbService from '../../Appwrite/db'
import { useAuth } from '../../AuthContext/UserAuthContext'
import { MapPin, Calendar, Plus, UserPlus, ArrowRight } from 'lucide-react'

function ClubDetails() {
  const { id: clubId } = useParams()
  const { user } = useAuth()
  const [club, setClub] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubData = await dbService.getClub(clubId)
        setClub(clubData)
        const postsData = await dbService.getPosts(clubId)
        setPosts(postsData.documents)
      } catch (error) {
        console.error("Error fetching club details:", error)
      } finally {
        setLoading(false)
      }
    }
    if (clubId) fetchClubData()
  }, [clubId])

  const isMember = () => {
    if (!user || !user.memberships) return false
    return user.memberships.some(m => m.clubId === clubId)
  }

  const handleJoinRequest = async () => {
    if (!user) { navigate('/login'); return }
    setRequesting(true)
    try {
      await dbService.createJoinRequest(clubId, user.$id)
      alert("Join request sent! Wait for club admins to approve.")
    } catch (error) {
      console.error("Failed to send join request", error)
      alert("Failed to send join request. You might have already requested.")
    } finally {
      setRequesting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  )

  if (!club) return (
    <div className="text-center py-20" style={{ color: 'var(--text-muted)', fontFamily: 'poppins' }}>
      Club not found.
    </div>
  )

  const getRandomImg = () => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      {/* Banner */}
      <div
        className="relative w-full rounded-2xl overflow-hidden mb-10 group"
        style={{ height: 'clamp(200px, 30vw, 320px)' }}
      >
        <img
          src={club.img || getRandomImg()}
          alt={club.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}
        />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              style={{ fontFamily: 'poppins-sb', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: '#fff', lineHeight: 1.2, marginBottom: '0.35rem' }}
            >
              {club.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'poppins', fontSize: '0.9rem', maxWidth: '480px' }}>
              {club.description}
            </p>
          </div>
          <div>
            {isMember() ? (
              <Link
                to={`/clubs/${clubId}/add-post`}
                className="btn flex items-center gap-1.5"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Plus size={14} /> Create Post
              </Link>
            ) : (
              <button
                onClick={handleJoinRequest}
                disabled={requesting}
                className="btn flex items-center gap-1.5"
                style={{ whiteSpace: 'nowrap' }}
              >
                <UserPlus size={14} />
                {requesting ? 'Requesting…' : 'Request to Join'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="section-title mb-6">Recent Events &amp; Posts</h2>

        {posts.length === 0 ? (
          <div
            className="card text-center py-16"
            style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.9rem' }}
          >
            <p>No posts yet for this club.</p>
            {isMember() && (
              <Link
                to={`/clubs/${clubId}/add-post`}
                style={{ color: 'var(--accent)', fontFamily: 'poppins-sb', fontSize: '0.85rem', display: 'inline-block', marginTop: '0.5rem', textDecoration: 'none' }}
                className="hover:underline"
              >
                Be the first to create one!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => (
              <div
                key={post.$id}
                className="card group overflow-hidden"
                style={{ borderRadius: 'var(--radius-lg)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                {post.featuredImage && (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={dbService.getFilePreview(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 style={{ fontFamily: 'poppins-sb', fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }} className="line-clamp-1">
                    {post.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'poppins', marginBottom: '1rem' }} className="flex flex-col gap-1">
                    {post.startDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {new Date(post.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {post.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {post.location}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/post/${post.$id}`}
                    className="flex items-center gap-1 group/btn"
                    style={{ color: 'var(--accent)', fontFamily: 'poppins-sb', fontSize: '0.8rem', textDecoration: 'none' }}
                  >
                    Read More <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubDetails
