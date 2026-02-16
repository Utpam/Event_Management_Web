import React, { useState } from 'react'

function HomeList({title, location, reg, start, end, img}) {
  return (
    <div className='w-full flex justify-between max-h-40 h-40 bg-[#FFF9EC] '>
        <div className='p-5 shrink-0'>
            <h1 className='text-4xl font-[poppins-sb] uppercase'>
                {title}
            </h1>
            <section className='font-[poppins] text-black/70 capitalize'>
                <h2 className=''>
                    <p className='inline font-bold'>Location - </p>{location}
                </h2>
                <h2 className='font-bold'>
                    Registration Open Till - {reg}
                </h2>
                <section className='flex gap-1'>
                    <h2>
                        {start}
                    </h2>
                     -
                    <h2>
                        {end}
                    </h2>
                </section>
            </section>
        </div>
        <div className='overflow-hidden m-1 cardGrad bg'>
            <div className='cardGrad absolute'>
            </div>
            <img src={img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThbeNe9VGYnau_rR-mMkKJEqYXJLyb22AEvA&s'} className='object-cover w-[150px]  h-full  ' />
            something
        </div>
    </div>
  )
}

export default HomeList