// components/NewsletterSection.tsx

import Image from 'next/image';
import React from 'react';

const NewsletterSection: React.FC = () => {
    return (
        <section className="w-full   bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] py-[100px] mt-[185px]">
            <div className= " flex md:flex-row flex-col gap-[50px] lg:gap-[200px] max-w-[1145px] mx-auto items-center px-4 ">
                <div>
                <h2 className=" text-[38px] lg:text-[48px] leading-[50px] lg:leading-[60px] font-bold text-white">
                    Join Our Newsletter
                </h2>
                <p className="mt-2 text-[16px] lg:text-[18px] leading-[22px] lg:leading-[32px] font-normal text-white/90">
                    Just insert your email into the field below. And you will get
                    the updates about Wave ai and new features from us.
                </p>
                </div>
                <form className="mt-6 flex items-center lg:min-w-[400px] justify-center h-[56px] rounded-[8px] bg-white p-1 w-auto ">
                    <div className='flex flex-1 items-center gap-[8px] p-3 bg-white'>
                        <Image src="/email.svg" width={18} height={18} alt='height' />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="  border border-white/20 bg-white  text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 sm:mb-0 w-auto "
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="ml-0   bg-[#264760] rounded-[4px] px-6 py-3 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50  w-auto"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;
