

import React from 'react'
import Image from 'next/image'
const LandingHero = () => {
  return (
    <div>
        <div className='max-w-[1000px] mt-[90px] mx-auto flex flex-col justify-center items-center px-3'>
            <Image src="/icons/wave.svg" width={97} height={36} alt='wave'/>
            <h1 className=' font-bold text-[28px] leading-[42px] sm:leading-[54px] lg:text-[54px] xl:text-[64px] lg:leading-[64px] xl:leading-[74px] text-center text-[#222222]'>Stop Drowning in Documentation. <span className='bg-[#def0ef] px-2 rounded-[10px]'> Start Connecting </span> With Patients Again</h1>
            <p className=' font-normal mt-[25px] text-[#555555] text-[14px] sm:text-[24px] lg:text-[32px] leading-[28px] sm:leading-[38px] lg:leading-[42px] text-center '>Spend less time on paperwork and more on patients with Waivs.ai – the AI-powered solution for fast, accurate clinical documentation.</p>
        </div>
        <Image src="/icons/dashboard.svg" className='w-full' width={1440} height={880} alt='dashboard'/>
    </div>
  )
}

export default LandingHero