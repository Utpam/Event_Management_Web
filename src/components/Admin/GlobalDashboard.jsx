import React, { useState, useEffect } from 'react';
import dbService from '../../../Appwrite/db';
import { useAuth } from '../../../AuthContext/UserAuthContext';

const GlobalDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await dbService.getClubRequests('pending');
                setRequests(data.documents);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (request) => {
        setUpdating(true);
        try {
            await dbService.updateClubRequestStatus(request.$id, 'approved', user.$id);

            // Create Club
            // Create data object for club creation
            const clubData = {
                name: request.clubName,
                description: request.description,
                createdBy: request.requestedBy,
                ownerId: request.requestedBy
            };

            const club = await dbService.createClub(clubData);

            // Create Team & Membership
            try {
                const team = await dbService.createClubTeam(club.$id, request.clubName);

                // We need user email to invite
                const userProfile = await dbService.getUserProfile(request.requestedBy);
                if (userProfile) {
                    await dbService.addTeamMember(team.$id, userProfile.email, ['owner', 'admin']);
                }
            } catch (teamError) {
                console.error("Team creation warning:", teamError);
                // Continue even if team creation warns (e.g. if running locally and team exists)
            }

            // Create Member Record
            await dbService.createClubMember(club.$id, request.requestedBy, 'club_admin');

            // Remove request from list
            setRequests(prev => prev.filter(r => r.$id !== request.$id));
            alert("Club Approved and Created!");
        } catch (error) {
            console.error("Approval failed:", error);
            alert("Failed to approve club. Check console.");
        } finally {
            setUpdating(false);
        }
    };

    const handleReject = async (requestId) => {
        if (!confirm("Are you sure you want to reject this request?")) return;
        setUpdating(true);
        try {
            await dbService.updateClubRequestStatus(requestId, 'rejected', user.$id);
            setRequests(prev => prev.filter(r => r.$id !== requestId));
        } catch (error) {
            console.error("Rejection failed:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-white text-center p-10">Loading Dashboard...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-white font-[poppins-sb]">Global Admin Dashboard</h1>

            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-white border-b border-slate-700 pb-2">Pending Club Requests</h2>

                {requests.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic">No pending club requests found.</div>
                ) : (
                    <div className="grid gap-4">
                        {requests.map(req => (
                            <div key={req.$id} className="bg-slate-700/50 p-5 rounded-xl border border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-slate-700/70">
                                <div>
                                    <h3 className="font-bold text-lg text-white font-[poppins-sb]">{req.clubName}</h3>
                                    <p className="text-sm text-gray-300 mt-1 mb-2 line-clamp-2">{req.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="bg-slate-800 px-2 py-1 rounded">ID: {req.requestedBy}</span>
                                        <span>•</span>
                                        <span>{new Date(req.$createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <button
                                        onClick={() => handleApprove(req)}
                                        disabled={updating}
                                        className={`bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm flex-1 md:flex-none ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {updating ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.$id)}
                                        disabled={updating}
                                        className={`bg-red-600/80 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm flex-1 md:flex-none ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalDashboard;
