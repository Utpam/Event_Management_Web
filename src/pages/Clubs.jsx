import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import searchIcon from '../assets/search.png'
import dbService from '../../Appwrite/db'
import { useAuth } from '../../AuthContext/UserAuthContext'

function Clubs() {

  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const result = await dbService.getClubs();
        setClubs(result.documents);
      } catch (error) {
        console.error("Failed to fetch clubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const isClubAdmin = (clubId) => {
    if (!user || !user.memberships) return false;
    const membership = user.memberships.find(m => m.clubId === clubId);
    return membership && (membership.role === 'owner' || membership.role === 'club_admin');
  };

  const [query, setQuery] = useState('')

  // Fallback images if not in DB, logic can be improved later
  const getRandomImg = () => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80';

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(query.toLowerCase()) ||
    club.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="w-full pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-[poppins-sb] text-white leading-tight">
            Explore Clubs
            <span className="block text-lg font-[poppins-lt] text-[var(--color-primary)] mt-1">Join a community that shares your passion</span>
          </h1>
        </div>

        {/* Search */}
        <div className="glass-card rounded-full p-2 flex items-center w-full md:w-auto min-w-[300px] transition-all focus-within:ring-1 focus-within:ring-[var(--color-secondary)]">
          <div className="p-2 bg-[var(--color-secondary)]/20 rounded-full text-[var(--color-secondary)]">
            <img src={searchIcon} className='w-4 h-4 invert brightness-0 filter' />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a club..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-400 px-3 font-[poppins] text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2'>
        {loading ? <p className="text-white text-center col-span-full">Loading clubs...</p> : filteredClubs.map((club) => (
          <div key={club.$id} className='glass-card group rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'>

            {/* Image Area */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={club.img || getRandomImg()}
                alt={club.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
              <h2 className='absolute bottom-4 left-4 text-2xl font-[poppins-sb] text-white drop-shadow-lg'>{club.name}</h2>
            </div>

            {/* Content Area */}
            <div className="p-5">
              <p className='text-[var(--color-text-muted)] font-[poppins-lt] text-sm line-clamp-3 mb-4 h-[4.5em]'>
                {club.description}
              </p>
              <Link to={`/clubs/${club.$id}`} className="text-[var(--color-secondary)] font-[poppins-sb] text-sm hover:underline flex items-center gap-1 group/btn">
                View Details
                <span className="transition-transform group-hover/btn:translate-x-1">→</span>
              </Link>

              {isClubAdmin(club.$id) && (
                <Link to={`/clubs/${club.$id}/dashboard`} className="mt-2 text-yellow-400 font-[poppins-sb] text-sm hover:underline flex items-center gap-1">
                  Manage Club
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-20 text-[var(--color-text-muted)] font-[poppins]">
          <p>No clubs found</p>
        </div>
      )}

    </div>
  )
}

export default Clubs