"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSession } from "@/app/contexts/SessionContext";
import { SESSION_STEPS } from "@/enums";

const PreparingSession = () => {
  const { setCurrentStep } = useSession();

  return (
    <Dialog open={true}>
      <DialogContent className="sm:min-w-[494px] py-[45px]">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674] text-center font-semibold text-[24px] leading-[32px]">
            Preparing Session
          </DialogTitle>
          <DialogDescription className="text-[#718096] text-center leading-[24px] text-[16px]">
            Please wait
          </DialogDescription>
        </DialogHeader>

        {/* Shimmer Loading Animation */}
        <div className="flex flex-col items-center justify-center py-[60px] space-y-4 mt-4">
          <span className="text-[#2B3674] font-bold text-[16px]">
            Generating...
          </span>
          <div className="relative w-full max-w-[400px] h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div className="absolute inset-0 animate-[moving-gradient_2s_ease-in-out_infinite] bg-[linear-gradient(90deg,#2C6BAC_25%,#38B2AC_50%,#2C6BAC_75%)] bg-[length:200%_100%]" />
          </div>
        </div>

        {/* Stop Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            className="bg-[#E53E3E0D] text-[#E53E3E] w-[185px] h-[46px] flex items-center text-[15px] leading-[15px] font-semibold px-[24px] py-[12px] rounded-lg hover:bg-red-200 transition"
            onClick={() => {
              setCurrentStep(SESSION_STEPS.RECORDING);
            }}
          >
            <X className="w-4 h-4 mr-2" /> Stop Generating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreparingSession;
