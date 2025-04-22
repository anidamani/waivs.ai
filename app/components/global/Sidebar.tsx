import Image from "next/image";
import React from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Translate } from "./Translate";
const Sidebar = () => {
  return (
    <div className="w-[290px] min-w-[290px] hidden h-screen overflow-hidden bg-white pl-[30px] py-[40px] lg:flex flex-col">
      <Image src="/logo.svg" width={168} height={30} alt="logo" />

      {/* Main section */}
      <div className="flex flex-col flex-grow">
        {/* Dashboard Link */}
        <Link href="/dashboard">
          <div className="border-r-4 mt-[60px] border-[#2C6BAC] flex items-center gap-[12px]">
            <Image src="/home.svg" width={28} height={28} alt="" />

            <h4 className="text-[#2C6BAC] font-medium text-[18px] leading-[30px]">
              <Translate>Dashboard</Translate>
            </h4>
          </div>
        </Link>

        {/* Bottom items (Settings, Logout) */}
        <div className="mt-auto flex flex-col gap-2 pr-[28px]">
          <div className="flex items-center gap-[12px] py-[12px] px-[16px] rounded-[16px] bg-[#5E63661A]">
            <Image
              src="/icons/settings.svg"
              width={22}
              height={22}
              alt="settings"
            />
            <h4 className="font-normal text-[14px]">
              <Translate>Settings</Translate>
            </h4>
          </div>
          <SignOutButton>
            <div className="flex items-center gap-[12px] py-[12px] px-[16px] rounded-[16px] text-[#CC5F5F] cursor-pointer">
              <Image
                src="/icons/logout.svg"
                width={22}
                height={22}
                alt="logout"
              />
              <h4 className="font-normal text-[14px]">
                <Translate>Logout</Translate>
              </h4>
            </div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
