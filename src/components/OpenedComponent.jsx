import React from 'react'
import { MapPin, Calendar, Clock } from 'lucide-react'

function OpenedComponent({ title, img, location, detailed_description, reg = 'TBA', start = 'TBA', end = 'TBA' }) {
  return (
    <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto" style={{ borderRadius: 'var(--radius-lg)' }}>
      {/* Left — Image */}
      <div className="w-full md:w-2/5 shrink-0 h-56 md:h-auto relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)' }}>
        <img
          src={img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
          className="w-full h-full object-cover"
          alt={title}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }}
        />
      </div>

      {/* Right — Details */}
      <div
        className="flex flex-col gap-5 p-6 md:p-8 flex-grow"
        style={{ background: 'var(--surface)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0' }}
      >
        {/* Title & Location */}
        <div>
          <h2
            style={{ fontFamily: 'poppins-sb', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'var(--text)', lineHeight: 1.25, marginBottom: '0.4rem' }}
          >
            {title}
          </h2>
          {location && (
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Date info grid */}
        <div
          className="grid grid-cols-2 gap-4 py-4"
          style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <p style={{ fontFamily: 'poppins-sb', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
              Registration Closes
            </p>
            <p style={{ fontFamily: 'poppins-sb', color: 'var(--text)', fontSize: '0.9rem' }}>{reg}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'poppins-sb', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
              Event Date
            </p>
            <p style={{ fontFamily: 'poppins-sb', color: 'var(--text)', fontSize: '0.9rem' }}>{start}{end !== start && end !== 'TBA' ? ` – ${end}` : ''}</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex-grow">
          <h3 style={{ fontFamily: 'poppins-sb', fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
            About this event
          </h3>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'poppins', fontSize: '0.875rem', lineHeight: 1.7 }}>
            {detailed_description || "Join us for an exciting event filled with learning, networking, and fun! Don't miss out on this opportunity to connect with like-minded individuals."}
          </p>
        </div>

        <button id="event-register-btn" className="btn w-full" style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
          Register Now
        </button>
      </div>
    </div>
  )
}

export default OpenedComponent