"use client";
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AudioPlayer from "@/app/components/profileComponents/AudioPlayer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Patient, Session } from "@/types";
import { useUser } from "@clerk/nextjs";
import { secondsToMinutesAndSeconds } from "@/lib/utils";
import { Translate } from "../global/Translate";
import RichTextEditor from "../global/RichTextEditor";
import Tooltip from "../global/Tooltip";

const Transcript = ({
  session,
  patient,
}: {
  session: Session;
  patient: Patient;
}) => {
  const [search, setSearch] = useState("");
  const { user } = useUser();

  const filteredMessages = session?.transcription.filter((msg) =>
    msg.text.toLowerCase().includes(search.toLowerCase())
  );

  const html = useMemo(() => {
    let draft = `<h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Session Transcript</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Patient: ${patient.name}</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Patient ID: ${
      patient.patient_id || "N/A"
    }</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Doctor: ${user?.fullName}</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Session ID: ${session.id}</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Session Date: ${new Date(
      session.created_at
    ).toDateString()}</h1>`;
    draft += `<h1 style="font-size: 18px; font-weight: bold; margin: 0;">Session Time: ${new Date(
      session.created_at
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</h1>`;
    session.transcription.forEach((msg) => {
      draft += `<p style="margin-bottom: 10px;"><b>${
        msg.role === "doctor" ? user?.fullName : patient.name
      }:</b> ${msg.text}</p>`;
    });
    return draft;
  }, [session.transcription]);

  return (
    <div className="bg-white mt-[17px] h-fit md:max-h-screen overflow-auto rounded-[30px] py-[28px] px-[26px]">
      {/* Header */}
      <div className="flex sm:flex-row flex-col gap-3 justify-between">
        <h2 className="text-[22px] leading-[32px] font-bold text-[#2B3674]">
          <Translate>Transcript</Translate>
        </h2>
        <div className="flex h-[40px] border px-3 rounded-[8px] min-w-[240px] items-center gap-2">
          <Search />
          <Input
            className="border-none focus:outline-none focus:ring-0"
            placeholder="Search messages or test names"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Transcript Data */}
      <div className="flex flex-col gap-3 mt-[15px]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px]">
            <Image src="/icons/cal2.svg" width={20} height={20} alt="" />
            <span className="font-medium text-[12px] leading-[20px] text-[#38B2AC]">
              {new Date(session.created_at).toDateString()} -{" "}
              {new Date(session.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px]">
            <Image src="/icons/timer.svg" width={20} height={20} alt="" />
            <span className="font-medium text-[12px] leading-[20px] text-[#38B2AC]">
              {secondsToMinutesAndSeconds(
                session.transcription[session.transcription.length - 1]
                  ?.endTime || 0
              )}{" "}
              min
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="mt-5" id="transcript">
        {filteredMessages?.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 ${
              msg.role === "doctor" ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex flex-col gap-[7px]">
              <div
                className={`flex items-center ${
                  msg.role === "doctor" ? "justify-start" : "justify-end"
                } gap-[10px]`}
              >
                <Tooltip text={msg.role}>
                  <Avatar>
                    <AvatarImage
                      src={
                        msg.role === "doctor"
                          ? user?.imageUrl
                          : patient.image_url
                      }
                      alt={msg.role}
                    />
                    <AvatarFallback>
                      {msg.role === "doctor" ? "D" : "P"}
                    </AvatarFallback>
                  </Avatar>
                </Tooltip>
                <p className="font-normal text-[16px] leading-[26px] text-[#919AB4]">
                  {msg.role === "doctor"
                    ? user?.fullName || "Doctor"
                    : patient.name}{" "}
                  <span>
                    {calculateTime(session.created_at, msg.startTime)}
                  </span>
                </p>
              </div>
              <p className="text-gray-800 mt-[7px] max-w-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden">
        <RichTextEditor
          uid={`transcript-mce`}
          initialHTML={html}
          onChange={(val) => {
            console.log(val);
          }}
        />
      </div>

      <AudioPlayer audioUrl={session.recording_url} />
    </div>
  );
};

export default Transcript;

const calculateTime = (
  sessionStartTime: Date,
  secondsAfterSessionStart: number
) => {
  const sessionDate = new Date(sessionStartTime);
  const time = new Date(
    sessionDate.getTime() + secondsAfterSessionStart * 1000
  );
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
