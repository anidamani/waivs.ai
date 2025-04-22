import React from 'react'
import Image from 'next/image'
const data = [
  {
    "title": "AI-Powered Clinical Notes",
    "description": "Automate Documentation With AI-Generated SOAP Notes, Saving Time And Improving Accuracy.",
    "icon": "/icons/a1.svg",
    "color": "red"
  },
  {
    "title": "Real-Time Transcription",
    "description": "Capture And Convert Patient Conversations Into Structured Text Instantly With High Precision.",
    "icon": "/icons/a2.svg",
    "color": "green"
  },
  {
    "title": "Seamless EMR Integration",
    "description": "Effortlessly Sync Notes With Your Electronic Medical Records (EMR) System For Smooth Workflow Management.",
    "icon": "/icons/a3.svg",
    "color": "blue"
  },
  {
    "title": "Secure & Compliant",
    "description": "HIPAA & PHIPA-Compliant, Ensuring Your Data Remains Private, Encrypted, And Protected.",
    "icon": "/icons/a4.svg",
    "color": "yellow"
  },
  {
    "title": "Multi-Platform Accessibility",
    "description": "Access AI Scribe On Web, Mobile, And Chrome Extension For Flexible And On-The-Go Documentation.",
    "icon": "/icons/a5.svg",
    "color": "purple"
  },
  {
    "title": "Customizable Templates",
    "description": "Choose From Predefined Clinical Templates Or Create Your Own For Personalized Documentation Needs.",
    "icon": "/icons/a6.svg",
    "color": "orange"
  }
]
const AIPowered = () => {
  return (
    <div className='max-w-[1262px] mx-auto mt-[40px]'>
      <div className='flex flex-col justify-center items-center'>
        <h1 className=' text-[28px] md:text-[36px] font-bold text-center text-[#000000] '>

          AI-Powered Clinical Documentation
        </h1>
        <p className='text-[#000000] md:max-w-[70%] font-normal text-center text-[18px] leading-[28px]'>Automate medical note-taking with AI-driven transcription and seamless EMR integration. Faster, smarter, and secure—so you can focus on patient care.</p>
      </div>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 mt-[55px]'>
        {
          data.map((item, index) =>
            <div key={index} className='p-[40px]'>
              <Image src={item.icon} alt='' height={102} width={102} />
              <h3 className='  py-[18px] text-[24px] font-semibold text-[#000000] '>{item.title}</h3>
              <p className='text-[18px] leading-[28px] font-medium text-[#00000099]'>Automate documentation with AI-generated SOAP notes, saving time and improving accuracy.</p>

            </div>
          )}
      </div>
      <div className='bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] py-[45px] px-[50px] rounded-[24px] max-w-[1076px] mx-auto mt-[150px]'>
        <div className='grid md:grid-cols-3 gap-[50px]'>
          <div className='flex flex-col  items-center'>
            <h1 className='text-white font-bold text-[48px] leading-[50px]'>110+</h1>
            <p className='text-white text-center text-[16px] leading-[24px] font-medium '>Prebuilt templates for faster clinical documentation</p>
          </div>
          <div className='flex flex-col  items-center'>
            <h1 className='text-white font-bold text-[48px] leading-[50px]'>4M</h1>
            <p className='text-white text-center text-[16px] leading-[24px] font-medium '>Medical notes generated with AI-powered</p>
          </div>
          <div className='flex flex-col items-center'>
            <h1 className='text-white font-bold text-[48px] leading-[50px]'>99.99%</h1>
            <p className='text-white text-center text-[16px] leading-[24px] font-medium '>Secure & compliant with HIPAA and PHIPA standards</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPowered