import React, { useState, useEffect } from 'react'
import dbService from '../../../Appwrite/db'
import { useAuth } from '../../../AuthContext/UserAuthContext'
import { CheckCircle, XCircle, Shield } from 'lucide-react'

const GlobalDashboard = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await dbService.getClubRequests('pending')
        setRequests(data.documents)
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleApprove = async (request) => {
    setUpdating(true)
    try {
      await dbService.updateClubRequestStatus(request.$id, 'approved', user.$id)
      const clubData = {
        name: request.clubName,
        description: request.description,
        createdBy: request.requestedBy,
        ownerId: request.requestedBy
      }
      const club = await dbService.createClub(clubData)
      try {
        const team = await dbService.createClubTeam(club.$id, request.clubName)
        const userProfile = await dbService.getUserProfile(request.requestedBy)
        if (userProfile) {
          await dbService.addTeamMember(team.$id, userProfile.email, ['owner', 'admin'])
        }
      } catch (teamError) {
        console.error("Team creation warning:", teamError)
      }
      await dbService.createClubMember(club.$id, request.requestedBy, 'club_admin')
      setRequests(prev => prev.filter(r => r.$id !== request.$id))
      alert("Club Approved and Created!")
    } catch (error) {
      console.error("Approval failed:", error)
      alert("Failed to approve club. Check console.")
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async (requestId) => {
    if (!confirm("Are you sure you want to reject this request?")) return
    setUpdating(true)
    try {
      await dbService.updateClubRequestStatus(requestId, 'rejected', user.$id)
      setRequests(prev => prev.filter(r => r.$id !== requestId))
    } catch (error) {
      console.error("Rejection failed:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <span className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          style={{
            width: '2.25rem', height: '2.25rem', background: 'var(--accent-subtle)',
            borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Shield size={16} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'poppins-sb', fontSize: '1.6rem', color: 'var(--text)', lineHeight: 1.2 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.875rem' }}>
            Review and manage club creation requests
          </p>
        </div>
      </div>

      {/* Requests Panel */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between mb-5" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'poppins-sb', fontSize: '1rem', color: 'var(--text)' }}>
            Pending Club Requests
          </h2>
          <span className="badge">{requests.length} pending</span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No pending club requests — all clear! ✓
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map(req => (
              <div
                key={req.$id}
                className="card-raised flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                style={{ padding: '1.1rem 1.25rem', transition: 'box-shadow 0.2s' }}
              >
                <div className="flex-grow min-w-0">
                  <h3 style={{ fontFamily: 'poppins-sb', fontSize: '1rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    {req.clubName}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.8rem', marginBottom: '0.5rem', lineHeight: 1.5 }}
                  >
                    {req.description}
                  </p>
                  <div className="flex items-center gap-2" style={{ fontSize: '0.73rem', color: 'var(--text-subtle)', fontFamily: 'poppins' }}>
                    <span
                      style={{
                        background: 'var(--bg-alt)', padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                      }}
                    >
                      {req.requestedBy}
                    </span>
                    <span>·</span>
                    <span>{new Date(req.$createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={updating}
                    className="btn flex items-center gap-1.5"
                    style={{
                      fontSize: '0.8rem', padding: '0.45rem 1rem',
                      background: 'var(--success)',
                    }}
                  >
                    <CheckCircle size={13} />
                    {updating ? 'Processing…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(req.$id)}
                    disabled={updating}
                    className="btn-danger flex items-center gap-1"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalDashboard
