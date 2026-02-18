import React from 'react'

function OpenedComponent({ title, img, location, description, reg, start, end }) {
  return (
    <div className='flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto'>
      {/* Left Side - Image */}
      <div className='w-full md:w-1/2 h-64 md:h-auto sticky top-0'>
        <img
          src={img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
          className='w-full h-full object-cover'
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] md:bg-gradient-to-r md:from-transparent md:to-[#0f172a] opacity-80"></div>
      </div>

      {/* Right Side - Details */}
      <div className='w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-6 bg-[#0f172a]/50'>

        <div>
          <h1 className='text-3xl md:text-4xl font-[poppins-sb] text-white leading-tight mb-2'>{title}</h1>
          <div className='flex items-center gap-2 text-[var(--color-secondary)] font-[poppins]'>
            <span>📍</span>
            <span>{location}</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 border-y border-white/10 py-6'>
          <div>
            <p className='text-[10px] uppercase text-[var(--color-text-muted)] tracking-wider font-bold'>Registration Ends</p>
            <p className='text-white font-[poppins-sb]'>{reg}</p>
          </div>
          <div>
            <p className='text-[10px] uppercase text-[var(--color-text-muted)] tracking-wider font-bold'>Event Date</p>
            <p className='text-white font-[poppins-sb]'>{start}</p>
          </div>
        </div>

        <div className='flex-grow'>
          <h3 className='text-lg font-[poppins-sb] text-white mb-2'>About Event</h3>
          <p className='text-[var(--color-text-muted)] font-[poppins-lt] leading-relaxed text-sm'>
            {description || "Join us for an exciting event filled with learning, networking, and fun! Don't miss out on this opportunity to connect with like-minded individuals."}
          </p>
        </div>

        <button className='button w-full py-4 text-lg font-bold shadow-lg shadow-indigo-500/20'>
          Register Now
        </button>
      </div>
    </div>
  )
}

export default OpenedComponent