import React from 'react'
import { Calendar, MapPin } from 'lucide-react'

function HomeList({ title, location, reg, start, end, img }) {
    return (
        <div className='flex flex-col h-full'>
            <div className='relative h-48 w-full overflow-hidden'>
                <img
                    src={img || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
                    alt={title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-[poppins-sb] text-white truncate drop-shadow-md">{title}</h3>
                    <div className="flex items-center text-gray-200 text-sm mt-1">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{location}</span>
                    </div>
                </div>
            </div>

            <div className='p-4 flex flex-col gap-2 flex-grow'>
                <div className="flex justify-between items-center text-sm text-[var(--color-text-muted)] font-[poppins]">
                    <span>Reg Ends:</span>
                    <span className="text-white font-[poppins-sb]">{reg}</span>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/10">
                    <div className="flex-1 text-center">
                        <p className="text-[10px] uppercase text-[var(--color-text-muted)] tracking-wider">Start</p>
                        <p className="font-[poppins-sb] text-white text-sm">{start}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex-1 text-center">
                        <p className="text-[10px] uppercase text-[var(--color-text-muted)] tracking-wider">End</p>
                        <p className="font-[poppins-sb] text-white text-sm">{end}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeList