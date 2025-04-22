
import React from 'react'
import Image from 'next/image'
const SmaterDocs = () => {
  return (
    <div className='mt-[180px] px-4 max-w-[1171px] mx-auto' >
        <div className='flex flex-col justify-center items-center'>
          <h1 className=' text-[24px] sm:text-[36px] font-bold text-center text-[#000000] '>

            Smarter Documentation,<br /> Faster Workflows
          </h1>
          <p className='text-[#000000] mt-[10px] mb-8 sm:max-w-[70%] font-normal text-center text-[14px] sm:text-[18px] leading-[28px]'>AI Scribe revolutionizes clinical documentation with real-time transcription, AI-powered SOAP notes, seamless EMR integration, and top-tier security.</p>
        </div>

        <div className='grid md:grid-cols-2 mb-6 items-center md:gap-[80px]'>
          <div className='flex flex-col '>
            <div className='max-w-[80%] pb-[40px] border-b border-black mb-[40px]'>
              <h4 className='text-[#000000] text-[20px] md:text-[30px] lg:text-[40px] font-bold  '>AI-Powered Clinical Notes</h4>
              <p className='text-[#00000099] mt-[20px] text-[16px] leading-[26px] font-medium'>Say goodbye to manual note-taking! AI Scribe intelligently listens, processes, and generates structured SOAP notes, ensuring clinical accuracy while reducing your documentation time. Let AI handle the paperwork so you can focus on patient care.</p>
            </div>
            <button className="text-gradient  flex items-center justify-center gap-[5px] rounded-[8px] text-[14px] leading-[20px] font-semibold border border-[#2C6BAC] py-[10px] px-[20px] flex-shrink-0 w-fit cursor-pointer">
              Generate AI- Notes
            </button>

          </div>
          <Image className='w-full' src="/s1.svg" width={624} height={400} alt='s1' />
        </div>
        <div className='grid md:grid-cols-2 mb-6 items-center md:gap-[80px]'>
          <Image className='w-full' src="/s2.svg" width={592} height={567} alt='s1' />
          <div className='flex flex-col '>
            <div className='max-w-[80%] pb-[40px] border-b border-black mb-[40px]'>
              <h4 className='text-[#000000] text-[20px] md:text-[30px] lg:text-[40px] font-bold  '>Real-Time Transcription</h4>
              <p className='text-[#00000099] mt-[20px] text-[16px] leading-[26px] font-medium'>Capture every word with lightning-fast, real-time transcription. AI Scribe converts doctor-patient conversations into structured text instantly, minimizing errors and ensuring you never miss a critical detail during consultations.</p>
            </div>
            <button className="text-gradient  flex items-center justify-center gap-[5px] rounded-[8px] text-[14px] leading-[20px] font-semibold border border-[#2C6BAC] py-[10px] px-[20px] flex-shrink-0 w-fit cursor-pointer">
              Start Transcription
            </button>

          </div>

        </div>
        <div className='grid md:grid-cols-[40%_60%] mb-6 items-center md:gap-[80px]'>
          <div className='flex flex-col '>
            <div className='max-w-[80%] pb-[40px] border-b border-black mb-[40px]'>
              <h4 className='text-[#000000] text-[20px] md:text-[30px] lg:text-[40px] font-bold  '>Multi-Platform Accessibility</h4>
              <p className='text-[#00000099] mt-[20px] text-[16px] leading-[26px] font-medium'>Work from anywhere, anytime. AI Scribe is available on web, mobile (iOS & Android), and as a Chrome extension, making it easy to document patient encounters whether you're in the clinic, on the go, or in a virtual consultation.</p>
            </div>
            <button className="text-gradient  flex items-center justify-center gap-[5px] rounded-[8px] text-[14px] leading-[20px] font-semibold border border-[#2C6BAC] py-[10px] px-[20px] flex-shrink-0 w-fit cursor-pointer">
            Learn More
            </button>

          </div>
          <Image className='w-full' src="/s3.svg" width={650} height={518} alt='s1' />
        </div>
      </div>
  )
}

export default SmaterDocs