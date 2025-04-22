// components/Testimonials.tsx
"use client"
import Image from 'next/image';
import React, { useState } from 'react';

interface TestimonialData {
  title: string;
  titleColor?: string; // e.g. #090F4E
  text: string;
  textColor?: string; // e.g. #63657E
  name: string;
  role: string;
  imageSrc: string; // e.g. /images/pricillia.jpg
}

interface TestimonialsProps {
  heading?: string;
  headingColor?: string; // e.g. text-gray-900
  commaIcon?: string; // e.g. /comma.svg
  bgColor?: string; // e.g. bg-white
  testimonials: TestimonialData[];
}

/**
 * Helper to validate/fallback any background color class
 */
function getSafeBgColor(bgColor: string | undefined) {
  if (!bgColor) return 'bg-white';
  return bgColor.startsWith('bg-') ? bgColor : 'bg-white';
}

const Testimonials: React.FC<TestimonialsProps> = ({
  heading = 'What Our Customer Are Saying',
  headingColor = 'text-gray-900',
  commaIcon = '/comma.svg',
  bgColor,
  testimonials,
}) => {
  // Carousel state: assume two testimonials per slide
  const slidesToShow = 2;
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = testimonials.length;

  // Calculate visible testimonials (wrap-around)
  const visibleTestimonials: TestimonialData[] = [];
  for (let i = 0; i < slidesToShow; i++) {
    visibleTestimonials.push(testimonials[(currentIndex + i) % total]);
  }

  const handlePrev = () => {
    setCurrentIndex((currentIndex - slidesToShow + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + slidesToShow) % total);
  };

  // Validate/fallback background color
  const finalBgColor = getSafeBgColor(bgColor);

  return (
    <section className={`w-full relative ${finalBgColor} py-12 mt-8`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row: Heading + Arrows */}
        <div className="mb-8 flex items-start justify-between">
          {/* Heading with quote icon */}
          <div className="flex items-start">
           
              <Image className='absolute top-0 lg:-top-3 left-0 lg:left-12 z-0' src={commaIcon} width={100} height={100} alt="comma icon" />
           
            <h2
              className={`text-xl relative z-10 font-bold leading-tight sm:text-3xl md:text-4xl ${headingColor}`}
            >
              What Our Customers <br/> Are Saying
            </h2>
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex h-10 w-10 items-center justify-center  text-indigo-700 hover:bg-gray-50"
            >
            <Image src="/arrow-left.svg" width={25} height={32} alt=''/>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full  text-indigo-700 hover:bg-gray-50"
            >
            <Image src="/arrow-right.svg" width={32} height={41} alt=''/>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {visibleTestimonials.map((testimonial, index) => {
            // For the second testimonial in the slide, add extra styling for vertical divider on md+
            const specialStyling =
              index === 1
                ? 'border-t pt-10 md:pt-0 border-gray-200  md:border-t-0 md:border-l md:pl-12'
                : '';

           

            return (
              <div key={index} className={specialStyling}>
                <h3 className={`mb-2 text-xl  font-semibold text-[#090F4E] `}>
                  {testimonial.title}
                </h3>
                <p className={`mb-4 mt-[20px] max-w-[80%] `}>{testimonial.text}</p>
                <div className="flex items-center">
                  {/* Testimonial Author Image */}
                  <img
                    src="/icons/user.svg"
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
