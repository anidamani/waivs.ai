

import React from 'react'
import Image from 'next/image'
const Brands = () => {
  return (
    <div className='max-w-[1056px] mx-auto mt-[47px] pb-[68px] px-3'>
          <h1 className=' text-center font-medium text-[#555555] text-[15px] leading-[20px]'>Helping to grow the next generation of companies</h1>
          <div className='grid grid-cols-2 sm:grid-cols-3 mf:grid-cols-4 lg:grid-cols-5 gap-y-[40px] mt-[41px]'>
            
            {
              [1,2,3,4,5,6,7,8,9,10].map((item,index)=>
            <Image key={index} src={`/brands/b${item}.svg`} width={144}  height={48} alt=''/>
            )}
          </div>
        </div>
  )
}

export default Brands