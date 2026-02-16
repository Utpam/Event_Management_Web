import React from 'react'

function Sidebar() {
    const routes = [
        {
            name: 'profile',
            route: '/profile'
        },
        {
            name: 'home',
            route: '/home',
        },
        {
            name: 'clubs',
            route: '/clubs',
        }
    ]
  return (
    <div>
        <section>
            <ul>
                {routes.map((route) => {
                    return (
                        <li className='capitalize font-[Mukta]'>
                            {route.name}
                        </li>
                    )
                })}
            </ul>
        </section>
    </div>
  )
}

export default Sidebar