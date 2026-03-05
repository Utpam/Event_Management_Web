import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dbService from '../../Appwrite/db';
import { useAuth } from '../../AuthContext/UserAuthContext';

function ClubDetails() {
    const { id: clubId } = useParams();
    const { user } = useAuth();
    const [club, setClub] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const clubData = await dbService.getClub(clubId);
                setClub(clubData);

                const postsData = await dbService.getPosts(clubId);
                setPosts(postsData.documents);
            } catch (error) {
                console.error("Error fetching club details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (clubId) fetchClubData();
    }, [clubId]);

    const isMember = () => {
        if (!user || !user.memberships) return false;
        return user.memberships.some(m => m.clubId === clubId);
    };

    const handleJoinRequest = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRequesting(true);
        try {
            await dbService.createJoinRequest(clubId, user.$id);
            alert("Join request sent successfully! Wait for club admins to approve.");
        } catch (error) {
            console.error("Failed to send join request", error);
            alert("Failed to send join request. You might have already requested.");
        } finally {
            setRequesting(false);
        }
    }

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;
    if (!club) return <div className="text-white text-center py-20">Club not found.</div>;

    const getRandomImg = () => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80';

    return (
        <div className="w-full max-w-7xl mx-auto pb-10">
            {/* Header / Banner */}
            <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-10 shadow-2xl group">
                <img
                    src={club.img || getRandomImg()}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 flex flex-col md:flex-row md:items-end justify-between w-[calc(100%-3rem)] md:w-[calc(100%-5rem)]">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-[poppins-sb] text-white drop-shadow-md mb-2">{club.name}</h1>
                        <p className="text-gray-300 font-[poppins-lt] max-w-2xl line-clamp-2 md:line-clamp-none">
                            {club.description}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        {isMember() ? (
                            <Link
                                to={`/clubs/${clubId}/add-post`}
                                className="button bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2 rounded-xl font-[poppins-sb] transition-colors shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2"
                            >
                                <span>+</span> Create Post
                            </Link>
                        ) : (
                            <button
                                onClick={handleJoinRequest}
                                disabled={requesting}
                                className={`button bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-[poppins-sb] transition-colors shadow-lg shadow-blue-600/20 ${requesting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {requesting ? 'Requesting...' : 'Request to Join'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                <h2 className="text-3xl font-[poppins-sb] text-white border-b border-slate-700 pb-2">Recent Events & Posts</h2>

                {posts.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-10 text-center border border-slate-700">
                        <p className="text-gray-400 font-[poppins-lt] text-lg">No posts available for this club yet.</p>
                        {isMember() && (
                            <Link to={`/clubs/${clubId}/add-post`} className="text-[var(--color-primary)] hover:underline mt-2 inline-block">
                                Be the first to create one!
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <div key={post.$id} className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                                {post.featuredImage && (
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={dbService.getFilePreview(post.featuredImage)}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-5">
                                    <h3 className="text-xl font-[poppins-sb] text-white mb-2 line-clamp-1">{post.title}</h3>

                                    <div className="text-xs text-gray-400 font-[poppins-lt] flex flex-col gap-1 mb-4">
                                        {post.startDate && <span>📅 {new Date(post.startDate).toLocaleDateString()}</span>}
                                        {post.location && <span>📍 {post.location}</span>}
                                    </div>

                                    {/* We would render RTE content securely in a real post details page, here we could just link to it */}
                                    <Link to={`/post/${post.$id}`} className="text-[var(--color-secondary)] text-sm font-[poppins-sb] hover:underline flex items-center gap-1 group/btn">
                                        Read More
                                        <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClubDetails;
