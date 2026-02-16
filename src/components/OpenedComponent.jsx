import React from 'react'
import ModalPortal from './modalPortal'

function OpenedComponent({title, img, location, description, reg, start, end}) {
  return (
    <div>
            <div className='bg-white'>
                <section>
                  <img src={img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThbeNe9VGYnau_rR-mMkKJEqYXJLyb22AEvA&s' } />
                  <div>
                    <h1> {location} </h1>
                    <h1> {reg} </h1>
                    <div>
                      <h1>{start}</h1>
                      <h1>{end}</h1>
                    </div>
                  </div>
                </section>
            </div>
            <div>
              {
                description
              }
            </div>
    </div>
  )
}

export default OpenedComponent