import React from 'react'
import { MapPin, Calendar } from 'lucide-react'

function HomeList({ title, location, reg = 'TBA', start, end, img }) {
  const hasDate = start && end

  return (
    <div className="flex flex-col h-full">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-sm"
      // style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
      >
        <img
          src={img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 gap-2">
        <h3
          className="truncate"
          style={{ fontFamily: 'poppins-sb', fontSize: '1rem', color: 'var(--text)', lineHeight: 1.3 }}
        >
          {title}
        </h3>

        {location && (
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <MapPin size={12} />
            <span className="truncate">{location}</span>
          </div>
        )}

        <div
          className="flex items-center justify-between mt-1"
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'poppins' }}
        >
          <span>Reg. closes</span>
          <span style={{ color: 'var(--text)', fontFamily: 'poppins-sb' }}>{reg}</span>
        </div>

        {hasDate ? (
          <div
            className="flex items-center gap-2 mt-auto pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <Calendar size={12} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
            <div className="flex gap-3 text-xs" style={{ fontFamily: 'poppins', color: 'var(--text-muted)' }}>
              <span><span style={{ color: 'var(--text-subtle)' }}>Start </span>{start}</span>
              <span>–</span>
              <span>{end}</span>
            </div>
          </div>
        ) : (
          <div
            className="mt-auto pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span className="badge">Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeList