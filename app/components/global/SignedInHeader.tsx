"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SessionModalsFlow from "../sessionComponents/SessionModalsFlow";
import { useSession } from "@/app/contexts/SessionContext";
import MobileSidebar from "./MobileSidebar";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { Translate } from "./Translate";

const SignedInHeader = () => {
  const pathname = usePathname(); // Get current route
  const { setIsModalOpen } = useSession();

  // Check if the user is on the profile page
  const isProfileRoute = pathname.includes("patient");

  // State for Mobile Sidebar
  const [openSideBar, setSideBar] = useState(false);
  // State for Language Dropdown
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { setLanguage, language } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between py-[25px] px-[16px] mb-[25px] lg:hidden rounded-[14px] bg-white">
        <Image
          onClick={() => setSideBar(true)}
          src="/icons/menu.svg"
          width={32}
          height={32}
          alt="menu"
        />
        <div className="relative">
          <div
            className="flex items-center justify-between custom-shadow3 w-[114px] bg-white rounded-[30px] py-[6px] px-[8.9px] cursor-pointer"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            <Image
              src="/icons/globel.svg"
              width={41}
              height={41}
              alt="globel"
            />
            <UserButton />
          </div>
          {showLanguageDropdown && (
            <div className="absolute  top-full mt-2 text-[#6C7684] right-0 w-[150px] bg-white rounded-lg shadow-lg p-2">
                {languageOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 px-3 rounded ${
                      language === option.value ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setLanguage(option.value);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <Image
                      src={option.flag}
                      width={20}
                      height={20}
                      alt={option.label}
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex sm:flex-nowrap flex-wrap gap-2 items-center justify-between">
        <div>
          <p className="font-medium text-[14px] leading-[24px] text-[#707EAE]">
           
            
          </p>
          <h1 className="text-[#2B3674] font-bold text-[16px] sm:text-[34px] sm:leading-[32px]">
            <Translate>
              {isProfileRoute ? "Patient Details" : "Patient Management"}
            </Translate>
          </h1>
        </div>
        <div className="flex items-center gap-[12px]">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-[10px] py-[16px] px-[24px] h-[40px] sm:h-[54px] flex items-center gap-[12px] font-semibold text-[15px] leading-[22px] bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC]"
          >
            <Image src="/icons/mic.svg" width={20} height={20} alt="" />
            <Translate>Start New Session</Translate>
          </Button>
          <div className="relative lg:flex items-center justify-between custom-shadow3 hidden bg-white rounded-[30px] py-[6px] px-[8.9px] gap-4">
            <Image
              src={
                languageOptions.find((option) => option.value === language)
                  ?.flag || "/icons/globel.svg"
              }
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              width={41}
              height={41}
              alt="globel"
              className="rounded-full w-[30px] h-[30px] cursor-pointer"
            />
            <UserButton />
            {showLanguageDropdown && (
              <div className="absolute  text-[#6C7684] top-full mt-2 right-0 w-[150px] bg-white rounded-lg shadow-lg p-2">
                {languageOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 px-3 rounded ${
                      language === option.value ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setLanguage(option.value);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <Image
                      src={option.flag}
                      width={20}
                      height={20}
                      alt={option.label}
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <SessionModalsFlow />
      <MobileSidebar isOpen={openSideBar} onClose={() => setSideBar(false)} />
    </div>
  );
};

export default SignedInHeader;

const languageOptions = [
  {
    label: "English",
    value: "en_US",
    flag: "/icons/us.svg",
  },
  {
    label: "French",
    value: "fr_FR",
    flag: "/icons/fre.svg",
  },
  {
    label: "Arabic",
    value: "ar_AR",
    flag: "/icons/ar.svg",
  },
];
