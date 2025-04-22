'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';
import Image from 'next/image';
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does AI Scribe ensure accuracy in transcription?',
    answer: 'AI Scribe uses advanced algorithms to enhance transcription accuracy, leveraging AI-driven models.',
  },
  {
    question: 'Can I edit AI-generated notes before saving them?',
    answer: 'Absolutely! AI Scribe allows you to review, edit, and customize notes before saving or exporting them to your EMR system.',
  },
  {
    question: 'Does AI Scribe integrate with my EMR system?',
    answer: 'Yes, AI Scribe is designed to seamlessly integrate with various EMR systems.',
  },
  {
    question: 'What platforms can I use AI Scribe on?',
    answer: 'AI Scribe is available on web and mobile platforms for flexibility and convenience.',
  },
  {
    question: 'Do I need to manually start and stop recordings?',
    answer: 'No, AI Scribe can automatically detect when to start and stop recordings based on context.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[990px] mx-auto mt-[150px] ">
        <div className='flex justify-center items-center'>
       <Image src="/fa.svg" width={220} height={40} alt=''/>
       </div>
      <h2 className=' font-bold mt-[20px] text-[26px] leading-[44px]  md:text-[32px] lg:text-[36px] md:leading-[64px] lg:leading-[74px] text-center text-[#222222]'>Have Any Thoughts? Look Here</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white cursor-pointer custom-shadow5 rounded-[10px] py-[32px] pl-[50px] pr-[30px]">
            <button
              className="w-full flex gap-2 justify-between text-[#000000] items-center font-medium text-left text-[16px] md:text-[24px] leading-[22px] md:leading-[30px] "
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? <Minus className="w-[32px] h-[32px]" /> : <Plus className="w-[32px] h-[32px]" />}
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
