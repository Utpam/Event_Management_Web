import React, { useState, useEffect } from 'react';
import dbService from '../../../Appwrite/db';
import { useAuth } from '../../../AuthContext/UserAuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [clubName, setClubName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            await dbService.createClubRequest({
                clubName,
                description,
                requestedBy: user.$id
            });
            alert("Request Submitted!");
            setClubName('');
            setDescription('');
            setActiveTab('requests'); // Switch to list
        } catch (error) {
            console.error("Failed to create request", error);
            alert("Failed to submit request.");
        }
    };
    
    const handleDeleteRequest = async (requestId) => {
        try {
            await dbService.deleteClubRequest(requestId);
            alert("Request deleted successfully!");
            // Refresh data or re-fetch
        } catch (error) {
            console.error("Failed to delete request", error);
            alert("Failed to delete request.");
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let result;
                if (activeTab === 'requests') {
                    result = await dbService.getUserClubRequests(user.$id);
                } else if (activeTab === 'registrations') {
                    // We need to fetch registration details (Post info)
                    // getRegistrations returns { userId, postId, ... }
                    // We need to fetch Post for each registration.
                    const regs = await dbService.getRegistrations(user.$id);
                    // Fetch relevant posts
                    const enriched = await Promise.all(regs.documents.map(async (reg) => {
                        try {
                            const post = await dbService.databases.getDocument(
                                dbService.client.config.databaseId, 
                            );
                            return { ...reg, post };
                        } catch (e) { return reg; }
                    }));
                    result = regs;
                }
                setData(result?.documents || []);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, activeTab, setData]);

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-white font-[poppins-sb]">User Dashboard</h1>

            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-2">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 ${activeTab === 'requests' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    My Club Requests
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`px-4 py-2 ${activeTab === 'registrations' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    My Registrations
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 ${activeTab === 'create' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}
                >
                    Request New Club
                </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg">
                {activeTab === 'create' ? (
                    <form onSubmit={handleCreateRequest} className="max-w-lg">
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Club Name</label>
                            <input
                                className="w-full bg-slate-700 text-white p-2 rounded"
                                value={clubName}
                                onChange={e => setClubName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Description</label>
                            <textarea
                                className="w-full bg-slate-700 text-white p-2 rounded"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Request</button>
                    </form>
                ) : loading ? (
                    <div className="text-gray-400">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="text-gray-500">No items found.</div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'requests' && data.map(req => (
                            <div key={req.$id} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-bold">{req.clubName}</h3>
                                    <p className="text-xs text-gray-400">Status: {req.status}</p>
                                </div>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => handleDeleteRequest(req.$id)}>Delete</button>
                            </div>
                        ))}
                        {activeTab === 'registrations' && data.map(reg => (
                            <div key={reg.$id} className="bg-slate-700 p-4 rounded-lg">
                                <p className="text-white">Event ID: {reg.postId}</p>
                                <p className="text-xs text-gray-400">Registered on: {new Date(reg.registeredAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
