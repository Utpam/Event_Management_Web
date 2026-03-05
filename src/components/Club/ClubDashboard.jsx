import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import dbService from '../../../Appwrite/db';
import { useAuth } from '../../../AuthContext/UserAuthContext';

const ClubDashboard = () => {
    const { id: clubId } = useParams();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('members');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!clubId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let result;
                if (activeTab === 'members') {
                    result = await dbService.getClubMembers(clubId);
                } else if (activeTab === 'requests') {
                    result = await dbService.getJoinRequests(clubId);
                } else if (activeTab === 'posts') {
                    result = await dbService.getClubPosts(clubId);
                }
                setData(result?.documents || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [clubId, activeTab]);

    const handleApproveJoin = async (requestId, userId) => {
        try {
            await dbService.updateJoinRequestStatus(requestId, 'approved');
            await dbService.createClubMember(clubId, userId, 'member');
            
            alert("Member Approved!");
            setData(prev => prev.filter(item => item.$id !== requestId));
        } catch (error) {
            console.error("Approval failed", error);
        }
    };

    const handleApprovePost = async (postId) => {
        try {
            await dbService.updatePostStatus(postId, 'approved');
            alert("Post Approved!");
            setData(prev => prev.map(item => item.$id === postId ? { ...item, status: 'approved' } : item));
        } catch (error) {
            console.error("Post approval failed", error);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white font-[poppins-sb]">Club Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-2 overflow-x-auto">
                {['members', 'requests', 'posts'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${activeTab === tab
                            ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl min-h-[400px]">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading {activeTab}...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic">No {activeTab} found.</div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'requests' && data.map(req => (
                            <div key={req.$id} className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">User ID: {req.userId}</p>
                                    <p className="text-xs text-gray-400">Status: {req.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApproveJoin(req.$id, req.userId)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'posts' && data.map(post => (
                            <div key={post.$id} className="bg-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-bold">{post.title}</h3>
                                    <p className="text-xs text-gray-400">Status: <span className={post.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}>{post.status}</span></p>
                                    <p className="text-xs text-gray-500">By: {post.createdBy}</p>
                                </div>
                                {post.status === 'pending' && (
                                    <button onClick={() => handleApprovePost(post.$id)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm">Publish</button>
                                )}
                            </div>
                        ))}

                        {activeTab === 'members' && data.map(member => (
                            <div key={member.$id} className="bg-slate-700/30 p-3 rounded-lg flex justify-between items-center">
                                <span className="text-gray-200">{member.userId}</span>
                                <span className="text-xs bg-slate-600 px-2 py-1 rounded text-gray-300 capitalize">{member.role}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubDashboard;
