"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "@/types";
import { secondsToMinutesAndSeconds } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Translate } from "../global/Translate";

const EncounterHistory: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEncounter, setSelectedEncounter] = useState<string>("all");
  const router = useRouter();
  const currentEncounter = useSearchParams().get("encounter");

  const filteredEncounters = sessions.filter((session) => {
    const matchesDate = selectedDate
      ? new Date(session.created_at) === new Date(selectedDate)
      : true;
    const matchesType =
      selectedEncounter === "all" ||
      (selectedEncounter === "recent" &&
        new Date(session.created_at) >= new Date("2024-03-01")) ||
      (selectedEncounter === "past" &&
        new Date(session.created_at) < new Date("2024-03-01"));

    return matchesDate && matchesType;
  });

  const status = "Completed";

  return (
    <div className="py-[24px] px-[23px] rounded-[20px] bg-white h-fit md:max-h-screen overflow-auto">
      <h3 className="text-[#2B3674] font-medium text-[20px]">
        <Translate>Encounter History</Translate>
      </h3>
      <p className="text-[13px] leading-[24px] font-medium text-[#A3AED0]">
        <Translate>Select a session to view details</Translate>
      </p>

      {/* Filters */}
      <div className="flex items-center gap-4 mt-2">
        {/* Date Picker */}
        <div className="relative flex items-center h-[40px] border border-gray-300 rounded-md px-3 text-gray-500">
          <Input
            type="date"
            className="border-none p-0 focus:ring-0 text-gray-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Encounter Dropdown */}
        <Select value={selectedEncounter} onValueChange={setSelectedEncounter}>
          <SelectTrigger className="border border-gray-300 px-3 rounded-md text-gray-500 w-[150px]">
            <SelectValue placeholder="Encounter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <Translate>All</Translate>
            </SelectItem>
            <SelectItem value="recent">
              <Translate>Recent</Translate>
            </SelectItem>
            <SelectItem value="past">
              <Translate>Past</Translate>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Encounter List */}
      <div className="flex flex-col gap-[16px] mt-[16px]">
        {filteredEncounters.length > 0 ? (
          filteredEncounters.map((encounter) => (
            <div
              key={encounter.id}
              onClick={() => {
                router.push(`?encounter=${encounter.id}`);
              }}
              className={`flex justify-between relative items-center rounded-[16px] border-2 px-[16px] py-[10px] cursor-pointer hover:bg-[#F4F7FE] transition-all duration-300 ${
                currentEncounter === encounter.id.toString()
                  ? "bg-[#F4F7FE] border-[#2C6BAC]"
                  : "border-[#EEF2F6]"
              }`}
            >
              <div className="bg-[#2C6BAC] absolute left-0 w-[2px] h-[26px]" />

              <div className="flex gap-2">
                <Image
                  src="/icons/calendar.svg"
                  width={42}
                  height={42}
                  alt="calendar"
                />
                <div>
                  <h3 className="text-[#2B3674] font-medium text-[14px] leading-[26px]">
                    {new Date(encounter.created_at).toLocaleDateString(
                      "en-US",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </h3>
                  <p className="text-[12px] leading-[20px] font-medium text-[#A3AED0]">
                    <Translate>Regular Checkup</Translate>
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-normal text-[#A3AED0]">
                  {new Date(encounter.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {secondsToMinutesAndSeconds(
                    encounter.transcription[encounter.transcription.length - 1]
                      ?.endTime || 0
                  )}{" "}
                  min
                </span>
                <div
                  className={`mt-[4px] w-fit rounded-[24px] text-[10px] font-medium px-[9px] py-[3.5px] 
                  ${
                    status === "Completed"
                      ? "bg-[#48BB7812] text-[#48BB78]"
                      : status === "Pending"
                      ? "bg-[#FACC1512] text-[#FACC15]"
                      : "bg-[#E53E3E12] text-[#E53E3E]"
                  }`}
                >
                  <Translate>{status}</Translate>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[14px] text-[#A3AED0] mt-4">
            <Translate>No encounters found.</Translate>
          </p>
        )}
      </div>
    </div>
  );
};

export default EncounterHistory;
