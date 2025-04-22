import React from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

const LandingNavBar = async () => {
  const { userId } = await auth();
  return (
    <div className="bg-white flex items-center justify-between py-[30px] px-[24px]">
      <Image src="/logo.svg" width={114} height={21} alt="" />

      <div className=" hidden lg:flex items-center justify-between gap-[50px]">
        <h3 className="text-[#222222] text-[17px] leading-[18px]">Home</h3>
        <h3 className="text-[#222222] text-[17px] leading-[18px]">Features</h3>
        <h3 className="text-[#222222] text-[17px] leading-[18px]">Pricing</h3>
        <h3 className="text-[#222222] text-[17px] leading-[18px]">
          Testimonials
        </h3>
        <h3 className="text-[#222222] text-[17px] leading-[18px]">FAQ</h3>
        <h3 className="text-[#222222] text-[17px] leading-[18px]">Contact</h3>
      </div>
      <Link
        href="/dashboard"
        className="bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] rounded-[12px] p-2 px-3 text-white"
      >
        {userId ? "Dashboard" : "Sign In"}
      </Link>
    </div>
  );
};

export default LandingNavBar;
