import React, { useState } from 'react'

function Clubs() {

  const [clubs, setClubs] = useState([
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
    {
      name: 'Utpam',
      description: 'zesxrdctfvbyuhimozsexrdctfvgybhunjxsrdctfvgybhndxsrdctfvygbuhbvftcdrxctfvygbhubugyvfctfvygbhunj'
    },
  ])
  
  return (
    <div className='grid grid-cols-5 gap-5 flex flex-col'>
      {
        clubs.map((club) => (
          <div className='bg-red-500 w-[16em] h-[25em] rounded-md'>
            <h1 className='text-4xl'>{club.name}</h1>
            <h1 className='wrap-anywhere'>{club.description}</h1>
          </div>
        ))
      }
    </div>
  )
}

export default Clubs