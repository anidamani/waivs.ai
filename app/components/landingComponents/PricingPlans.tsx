"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan,setSelectedPlan]=useState(1)
  const plans = [
    {
      name: "Starter Plan",
      price: 0,
      icon: "/icons/r.png",
      features: [
        "Up to 20 Notes Total",
        "AI Transcription",
        "AI Summarization",
        "Standard Note Templates",
        "Edit & Finalize Notes",
        "HIPAA/PIPEDA Compliant",
      ],
      buttonText: "Join Free",
    },
    {
      name: "Professional Plan",
      price: billingCycle === "monthly" ? 149 : 1499,
      icon: "/icons/e.png",
      features: [
        "Unlimited Notes",
        "AI Transcription",
        "AI Summarization",
        "Note Template Library",
        "Edit & Finalize Notes",
        "HIPAA/PIPEDA Compliant",
        "Priority Email Support",
      ],
      buttonText: "Start 14 Days Trial",
      highlight: true,
    },
    {
      name: "Advanced Plan",
      price: billingCycle === "monthly" ? 199 : 1999,
      icon: "/icons/g.png",
      features: [
        "Unlimited Notes",
        "AI Transcription",
        "AI Summarization",
        "Note Template Library",
        "Edit & Finalize Notes",
        "HIPAA/PIPEDA Compliant",
        "Direct EHR Integration",
        "AI Audio Agent",
        "Premium Support",
      ],
      buttonText: "Start 14 Days Trial",
    },
  ];

  return (
    <div className="py-12  text-center">
        <div className="flex flex-col justify-center items-center">
      <h2 className=" text-[32px] sm:text-[42px] lg:text-[48px] lg:max-w-[60%] font-bold">Find The Perfect Plan For Your Practice</h2>
      <p className=" text-[14px] lg:text-[18px] lg:max-w-[50%] leading-[30px] font-normal  mt-2">Simple, transparent pricing tailored for your practice fully HIPAA compliant, secure, and designed to save you time.</p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <Button
          variant={billingCycle === "monthly" ? "default" : "outline"}
          onClick={() => setBillingCycle("monthly")}
          className={` ${billingCycle==="monthly"?'bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC]':''} rounded-none px-[33px] py-[10px] `}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === "yearly" ? "default" : "outline"}
          onClick={() => setBillingCycle("yearly")}
          className={` ${billingCycle==="yearly"?'bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC]':''} rounded-none px-[33px] py-[10px] `}
        >
          Yearly
        </Button>
      </div>

      <div className="mt-[50px] grid md:grid-cols-3  md:max-w-5xl w-full mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={` flex justify-between h-[754px] flex-col px-[41px] py-[36px] ${
              selectedPlan==index ? "custom-shadow4" : ""
            }`}
          >
            <div>
                <div className="flex justify-center items-center">
            <Image src={plan.icon} width={52} height={62} alt="icon"/>
            </div>
            <h3 className="text-xl text-[#12141D] font- text-[13px] mt-[26px] leading-[18px] font-bold uppercase">{plan.name}</h3>
            <h4 className="text-[14px] leading-[20px] text-[#12141D]">Perfect for trying out the basics.</h4>
            <p className="font-bold text-[#12141D] text-[18px] leading-[24px] mt-[29px] mb-[36px]">$ <span className="text-[48px] leading-[49px] font-extrabold">{plan.price}</span>/mo</p>
            <ul className="mt-4 text-[#12141D] space-y-[13px]">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-[10px] text-[16px] leading-[24px] font-medium">
                  <Image src="/icons/tick2.svg" width={15} height={15} alt="tick"/>
                   {feature}
                </li>
              ))}
            </ul>
            </div>
            
            <div>
            <Button onClick={()=>setSelectedPlan(index)} className={` mt-6 bg-[#F4F4F5] hover:text-white  text-[#12141D] ${selectedPlan===index && ' bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white'}  py-[26px] rounded-[10px] w-full`}>{plan.buttonText}</Button>
            <p className="text-[14px] mt-[14px] leading-[20px] text-[#12141D]"> No credit card required</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
