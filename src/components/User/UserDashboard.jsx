import React, { useState, useEffect } from 'react'
import dbService from '../../../Appwrite/db'
import { useAuth } from '../../../AuthContext/UserAuthContext'
import { Trash2, PlusCircle } from 'lucide-react'

const UserDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('requests')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [clubName, setClubName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateRequest = async (e) => {
    e.preventDefault()
    try {
      await dbService.createClubRequest({ clubName, description, requestedBy: user.$id })
      alert("Request Submitted!")
      setClubName('')
      setDescription('')
      setActiveTab('requests')
    } catch (error) {
      console.error("Failed to create request", error)
      alert("Failed to submit request.")
    }
  }

  const handleDeleteRequest = async (requestId) => {
    try {
      await dbService.deleteClubRequest(requestId)
      setData(prev => prev.filter(item => item.$id !== requestId))
    } catch (error) {
      console.error("Failed to delete request", error)
      alert("Failed to delete request.")
    }
  }

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      setLoading(true)
      try {
        let result
        if (activeTab === 'requests') {
          result = await dbService.getUserClubRequests(user.$id)
        } else if (activeTab === 'registrations') {
          const regs = await dbService.getRegistrations(user.$id)
          result = regs
        }
        setData(result?.documents || [])
      } catch (err) {
        console.error("Failed to fetch user data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, activeTab])

  const tabs = [
    { key: 'requests', label: 'My Club Requests' },
    { key: 'registrations', label: 'My Registrations' },
    { key: 'create', label: 'Request New Club' },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'poppins-sb', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.875rem' }}>
          Manage your club requests and event registrations
        </p>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', gap: '0.25rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <div className="card" style={{ padding: '1.75rem', maxWidth: '520px' }}>
          <h2 style={{ fontFamily: 'poppins-sb', fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
            Request a New Club
          </h2>
          <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Club Name
              </label>
              <input
                className="input"
                placeholder="e.g. Photography Club"
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontFamily: 'poppins-sb', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Description
              </label>
              <textarea
                className="input"
                placeholder="What is this club about?"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn flex items-center gap-1.5">
                <PlusCircle size={14} /> Submit Request
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <span className="spinner" style={{ width: '1.75rem', height: '1.75rem', borderWidth: '2px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.9rem' }}>
          No items found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeTab === 'requests' && data.map(req => (
            <div
              key={req.$id}
              className="card flex items-center justify-between gap-4"
              style={{ padding: '1rem 1.25rem' }}
            >
              <div>
                <h3 style={{ fontFamily: 'poppins-sb', color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                  {req.clubName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="badge" style={{
                    background: req.status === 'approved' ? 'var(--success-subtle)' : req.status === 'rejected' ? 'var(--danger-subtle)' : 'var(--accent-subtle)',
                    color: req.status === 'approved' ? 'var(--success)' : req.status === 'rejected' ? 'var(--danger)' : 'var(--accent-text)',
                  }}>
                    {req.status || 'pending'}
                  </span>
                </div>
              </div>
              <button
                className="btn-danger flex items-center gap-1"
                onClick={() => handleDeleteRequest(req.$id)}
                style={{ flexShrink: 0 }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}

          {activeTab === 'registrations' && data.map(reg => (
            <div
              key={reg.$id}
              className="card"
              style={{ padding: '1rem 1.25rem' }}
            >
              <p style={{ color: 'var(--text)', fontFamily: 'poppins-sb', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                Event ID: {reg.postId}
              </p>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.78rem' }}>
                Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboard
