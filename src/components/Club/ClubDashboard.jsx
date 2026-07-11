import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import dbService from '../../../Appwrite/db'
import { useAuth } from '../../../AuthContext/UserAuthContext'
import { CheckCircle, Users, FileText, UserCheck } from 'lucide-react'

const ClubDashboard = () => {
  const { id: clubId } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('members')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clubId) return
    const fetchData = async () => {
      setLoading(true)
      try {
        let result
        if (activeTab === 'members') result = await dbService.getClubMembers(clubId)
        else if (activeTab === 'requests') result = await dbService.getJoinRequests(clubId)
        else if (activeTab === 'posts') result = await dbService.getClubPosts(clubId)
        setData(result?.documents || [])
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clubId, activeTab])

  const handleApproveJoin = async (requestId, userId) => {
    try {
      await dbService.updateJoinRequestStatus(requestId, 'approved')
      await dbService.createClubMember(clubId, userId, 'member')
      setData(prev => prev.filter(item => item.$id !== requestId))
    } catch (error) {
      console.error("Approval failed", error)
    }
  }

  const handleApprovePost = async (postId) => {
    try {
      await dbService.updatePostStatus(postId, 'approved')
      setData(prev => prev.map(item => item.$id === postId ? { ...item, status: 'approved' } : item))
    } catch (error) {
      console.error("Post approval failed", error)
    }
  }

  const tabs = [
    { key: 'members', label: 'Members', icon: Users },
    { key: 'requests', label: 'Join Requests', icon: UserCheck },
    { key: 'posts', label: 'Posts', icon: FileText },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'poppins-sb', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
          Club Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.875rem' }}>
          Manage members, join requests, and posts
        </p>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === key ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="spinner" style={{ width: '1.75rem', height: '1.75rem', borderWidth: '2px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.9rem', fontStyle: 'italic' }}>
          No {activeTab} found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Join Requests */}
          {activeTab === 'requests' && data.map(req => (
            <div
              key={req.$id}
              className="card flex items-center justify-between gap-4"
              style={{ padding: '1rem 1.25rem' }}
            >
              <div>
                <p style={{ fontFamily: 'poppins-sb', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  User ID: {req.userId}
                </p>
                <span className="badge">{req.status || 'pending'}</span>
              </div>
              <button
                onClick={() => handleApproveJoin(req.$id, req.userId)}
                className="btn flex items-center gap-1.5"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', flexShrink: 0 }}
              >
                <CheckCircle size={13} /> Approve
              </button>
            </div>
          ))}

          {/* Posts */}
          {activeTab === 'posts' && data.map(post => (
            <div
              key={post.$id}
              className="card flex items-center justify-between gap-4"
              style={{ padding: '1rem 1.25rem' }}
            >
              <div>
                <h3 style={{ fontFamily: 'poppins-sb', color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {post.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="badge"
                    style={{
                      background: post.status === 'approved' ? 'var(--success-subtle)' : 'var(--accent-subtle)',
                      color: post.status === 'approved' ? 'var(--success)' : 'var(--accent-text)',
                    }}
                  >
                    {post.status}
                  </span>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontFamily: 'poppins' }}>
                    by {post.createdBy}
                  </span>
                </div>
              </div>
              {post.status === 'pending' && (
                <button
                  onClick={() => handleApprovePost(post.$id)}
                  className="btn flex items-center gap-1.5"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', flexShrink: 0, background: 'var(--success)' }}
                >
                  <CheckCircle size={13} /> Publish
                </button>
              )}
            </div>
          ))}

          {/* Members */}
          {activeTab === 'members' && data.map(member => (
            <div
              key={member.$id}
              className="card flex items-center justify-between"
              style={{ padding: '0.85rem 1.25rem' }}
            >
              <span style={{ color: 'var(--text)', fontFamily: 'poppins', fontSize: '0.875rem' }}>
                {member.userId}
              </span>
              <span className="badge">{member.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClubDashboard
