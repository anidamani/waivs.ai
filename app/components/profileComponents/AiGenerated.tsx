import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { Session } from "@/types";
import DynamicNoteForm from "./DynamicForm";
import { AllSummaries } from "@/gemini/summary-types";
import { cn, secondsToMinutesAndSeconds } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "../global/Loader";
import { useSessionNote } from "@/hooks/supabase/useSessionNote";
import { Translate } from "../global/Translate";
import RichTextEditor from "../global/RichTextEditor";
import { Clipboard, Copy, PencilLine, Save, X } from "lucide-react";
import useGlobals from "@/app/contexts/GlobalContext";
import { toast } from "react-hot-toast";
const AiGenerated = ({
  session,
  generateSummary,
}: {
  session: Session;
  generateSummary: (summaryType: keyof AllSummaries) => void;
}) => {
  const searchParams = useSearchParams();
  const selectedType =
    (searchParams.get("summaryType") as keyof AllSummaries) || "SOAP";
  const [isEditing, setIsEditing] = useState(false);
  const { note, loading, error, updateNote, updateNoteContentLocal } =
    useSessionNote({
      sessionId: session.id,
      type: selectedType,
    });
  const noteContentRef = useRef(note?.content);
  const { getRef } = useGlobals();

  useEffect(() => {
    if (!note?.content || noteContentRef.current) return;
    noteContentRef.current = note?.content;
  }, [note]);

  console.log("noteContentRef", noteContentRef.current);

  return (
    <div className="bg-white h-fit md:h-screen overflow-auto rounded-[20px] px-[26px] py-[28px]">
      {/* Header Section */}

      <div className="flex sm:flex-row flex-col-reverse  justify-between gap-3 sm:items-center ">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h2 className=" text-[20px] sm:text-[22px] font-bold text-[#2B3674]">
            <Translate>AI-Generated Notes</Translate>
          </h2>

          <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex items-center rounded-[10px]">
            <span className="font-medium text-[14px] text-[#48BB78]">
              <Translate>Completed</Translate>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-[15px] ">
        <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px] ">
          <Image src="/icons/cal2.svg" width={20} height={20} alt="" />
          <span className=" font-medium text-[12px] leading-[20px] text-[#38B2AC]">
            {new Date(session.created_at).toDateString()} -{" "}
            {new Date(session.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px] ">
          <Image src="/icons/timer.svg" width={20} height={20} alt="" />
          <span className=" font-medium text-[12px] leading-[20px] text-[#38B2AC]">
            {secondsToMinutesAndSeconds(
              new Date(session.created_at).getSeconds() +
                session.transcription[0].endTime
            )}{" "}
            min
          </span>
        </div>
      </div>

      {note && (
        <div className="mt-3 flex items-center gap-3 justify-between mb-5">
          <p className="text-[14px] leading-[24px] font-medium text-[#707EAE]">
            <span className="text-[14px] leading-[24px] font-semibold ">
              <Translate>Last Edited:</Translate>{" "}
            </span>{" "}
            {new Date(note.updated_at).toLocaleString()}
          </p>

          <div className="flex items-center gap-1">
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  updateNoteContentLocal(noteContentRef.current || "");
                }}
              >
                <X />
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                const editor = getRef("notes-mce");
                if (editor) {
                  navigator.clipboard.writeText(editor.getContent());
                  toast.success("Copied to clipboard");
                }
              }}
            >
              <Copy />
            </Button>
            <Button
              className="bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white rounded-[10px] py-[20px] px-[16px] cursor-pointer"
              onClick={async () => {
                setIsEditing((prev) => {
                  if (prev === true) {
                    updateNote(note.content);
                    noteContentRef.current = note.content;
                  }
                  return !prev;
                });
              }}
            >
              {isEditing ? <Save /> : <PencilLine />}
              <Translate>{isEditing ? "Save" : "Edit"}</Translate>
            </Button>
          </div>
        </div>
      )}
      {/* Editable Notes Section */}
      {/* <EditableNotes summary={selectedSummary} /> */}
      {loading ? (
        <div className="flex justify-center items-center h-full min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <>
          <div className={cn(isEditing ? "block" : "hidden")}>
            <RichTextEditor
              uid={`notes-mce`}
              initialHTML={note?.content || ""}
              onChange={(val) => {
                updateNoteContentLocal(val);
              }}
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: note?.content || "" }}
            className={cn(
              `
            [&_h1]:text-[#2B3674] [&_h1]:text-[20px] [&_h1]:leading-7 [&_h1]:font-semibold
            [&_h2]:text-[#2B3674] [&_h2]:text-[18px] [&_h2]:leading-7 [&_h2]:font-semibold
            [&_h3]:text-[#2B3674] [&_h3]:text-[16px] [&_h3]:leading-7 [&_h3]:font-semibold
            [&_h4]:text-[#2B3674] [&_h4]:text-[14px] [&_h4]:leading-7 [&_h4]:font-semibold
            [&_h5]:text-[#2B3674] [&_h5]:text-[12px] [&_h5]:leading-7 [&_h5]:font-semibold
            [&_h6]:text-[#2B3674] [&_h6]:text-[10px] [&_h6]:leading-7 [&_h6]:font-semibold
            [&_p]:text-[#2B3674] [&_p]:text-[14px] [&_p]:leading-5 [&_p]:font-normal [&_p]:mb-2
            [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ul]:text-[#2B3674] [&_ul]:text-[14px] [&_ul]:leading-7 [&_ul]:font-normal
            [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_ol]:text-[#2B3674] [&_ol]:text-[14px] [&_ol]:leading-7 [&_ol]:font-normal
            [&_li]:text-[#2B3674] [&_li]:text-[14px] [&_li]:leading-7 [&_li]:font-normal
            [&_a]:text-[#2B3674] [&_a]:text-[14px] [&_a]:leading-7 [&_a]:font-normal
            [&_a]:underline
            [&_img]:w-full [&_img]:h-auto [&_img]:rounded-[10px] [&_img]:mt-3 [&_img]:mb-3
            [&_table]:w-full [&_table]:border-collapse [&_table]:border-gray-300 [&_table]:rounded-[10px] [&_table]:overflow-hidden
            [&_td]:p-2 [&_td]:border [&_td]:border-gray-300
            [&_th]:p-2 [&_th]:border [&_th]:border-gray-300
            [&_tr]:hover:[&_td]:bg-gray-100
            [&_tr]:hover:[&_th]:bg-gray-100
            [&_blockquote]:text-[#2B3674] [&_blockquote]:text-[14px] [&_blockquote]:leading-7 [&_blockquote]:font-normal
            `,
              isEditing ? "hidden" : "block"
            )}
          />
        </>
      )}
    </div>
  );
};

export default AiGenerated;
