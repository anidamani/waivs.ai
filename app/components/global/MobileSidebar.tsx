import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Translate } from "./Translate";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex ${isOpen ? "visible" : "invisible"}`}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-30"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="w-[290px] h-screen bg-white pl-[30px] py-[40px] flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}">
        <div className="flex justify-between items-center pr-4">
          <Image src="/logo.svg" width={168} height={30} alt="logo" />
          <button onClick={onClose} className="text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Main section */}
        <div className="flex flex-col flex-grow">
          <Link href="/">
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
            <div className="flex items-center gap-[12px] py-[12px] px-[16px] rounded-[16px] text-[#CC5F5F]">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
