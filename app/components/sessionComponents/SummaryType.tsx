"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/app/contexts/SessionContext";
import { SummaryTypeDetails } from "@/gemini/summary-types";
import { Translate } from "../global/Translate";
import { useTranslation } from "@/app/contexts/TranslationContext";

export default function SummaryType() {
  const [selectedFormat, setSelectedFormat] = useState<
    (typeof SummaryTypeDetails)[number] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const { getTranslation } = useTranslation();

  const { setIsModalOpen, nextStep, updateSessionData } = useSession();
  // Filter note formats based on search term
  const filteredFormats = SummaryTypeDetails.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFormat) setSelectedFormat(null);
    setSearchTerm(e.target.value);
  };

  return (
    <Dialog open={true} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className=" sm:min-w-[585px]">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674] font-semibold text-[24px] leading-[32px]">
            <Translate>Notes Format</Translate>
          </DialogTitle>
          <DialogDescription className="text-[#718096] leading-[24px] text-[16px]">
            <Translate>
              Choose the session type and note format before ending the session.
            </Translate>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 relative">
          {/* Search Input */}
          <div
            className="flex items-center justify-between py-[15px] px-[12px] sm:px-[20px] border-2 border-[#EEF2F6] rounded-[8px]"
            onClick={() => setSelectOpen(true)}
          >
            <div className="flex items-center gap-[12px] w-full">
              <Search />
              <input
                value={selectedFormat?.value ?? searchTerm}
                onChange={handleSearchChange}
                placeholder={getTranslation("Search Note format")}
                className="w-full outline-none"
              />
            </div>
            <Image src="/icons/arrow.svg" width={22} height={31} alt="arrow" />
          </div>

          {/* Dropdown with Matching Formats */}
          {selectOpen && (
            <div className="bg-white absolute w-full top-14 custom-shadow2 rounded-[14px] px-[20px] py-[15px] flex flex-col">
              {filteredFormats.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer p-2 rounded hover:bg-gray-100 border-b border-[#EEF2F6] last:border-b-0"
                  onClick={() => {
                    setSelectedFormat(item);
                    updateSessionData({ format: item.value });
                    setSearchTerm("");
                    setSelectOpen(false);
                  }}
                >
                  <h1 className="font-semibold text-[18px] leading-[24px] text-[#2B3674]">
                    {item.value}
                  </h1>
                  <h2 className="text-[16px] leading-[24px] font-medium text-[#718096]">
                    {item.label}
                  </h2>
                </div>
              ))}
            </div>
          )}

          {/* Selected Format Details */}
          {selectedFormat && (
            <div className="mt-[15px] w-full mb-[30px]">
              <p className="text-[15px] leading-[16px] font-semibold text-[#2B3674] mb-[12px]">
                <Translate>Format</Translate>
              </p>
              <div className="text-[14px] leading-[18px] text-[#2B3674] flex flex-col gap-3">
                {Object.entries(selectedFormat.structure).map(
                  ([letter, description]) => (
                    <p key={letter}>
                      <span className="bg-[#2C6BAC1A] rounded-[4px] font-medium text-[#2C6BAC] px-[7px] w-[24px] h-[24px]">
                        {letter}
                      </span>{" "}
                      {description}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button
            className="w-full bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] rounded-[10px] py-[22px] text-white"
            onClick={() => {
              nextStep();
            }}
          >
            <Translate>Continue</Translate>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
