"use client";

import { useEffect, useState } from "react";
import UserDetails from "@/app/components/profileComponents/UserDetails";
import EncounterHistory from "@/app/components/profileComponents/EncounterHistory";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Transcript from "@/app/components/profileComponents/Transcript";
import AiGenerated from "@/app/components/profileComponents/AiGenerated";
import { Patient, Session } from "@/types";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { supabaseClient } from "@/supabase/client";
import { Plus, RefreshCcw } from "lucide-react";
import { AllSummaries, SummaryTypes } from "@/gemini/summary-types";
import { generateSummaryNote } from "@/functions/summaries";
import { toast } from "react-hot-toast";
import { elementToPDF } from "@/lib/elementToPDF";
import { useSession } from "@/app/contexts/SessionContext";
import Loader from "@/app/components/global/Loader";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/app/components/global/Translate";
import { useTranslation } from "@/app/contexts/TranslationContext";
import useGlobals from "@/app/contexts/GlobalContext";

const Page = () => {
  const [activeTab, setActiveTab] = useState("notes");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyGenaretedTypes, setAlreadyGenaretedTypes] = useState<
    (keyof AllSummaries)[]
  >([]);
  const { id: patientId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const encounterId = searchParams.get("encounter");
  const summaryType = searchParams.get("summaryType") as keyof AllSummaries;
  const { updateSessionData, resetSession } = useSession();
  const { user } = useUser();
  const { getTranslation, language } = useTranslation();
  const { getRef } = useGlobals();
  useEffect(() => {
    const fetchPatientAndSessions = async () => {
      if (!user?.id) return;
      const patient = await supabaseClient
        .from("patients")
        .select("*")
        .eq("id", Number(patientId))
        .eq("doctor_id", user?.id!)
        .single()
        .overrideTypes<Patient>();
      if (patient.data) {
        setPatient(patient.data);
        const sessions = await supabaseClient
          .from("sessions")
          .select("*")
          .eq("patient_id", Number(patientId))
          .overrideTypes<Session[]>();
        if (sessions.data) {
          setSessions(sessions.data);
        }
      }
      setLoading(false);
    };
    fetchPatientAndSessions();
  }, [user, patientId]);

  useEffect(() => {
    const fetchAlreadyGenaretedTypes = async () => {
      const generatedNotes = await supabaseClient
        .from("summaries")
        .select("type")
        .eq("session_id", Number(encounterId));
      if (generatedNotes.data) {
        setAlreadyGenaretedTypes(
          generatedNotes.data.map((note) => note.type as keyof AllSummaries)
        );
      }
    };
    fetchAlreadyGenaretedTypes();
  }, [encounterId]);

  useEffect(() => {
    if (patient) {
      updateSessionData({ patient: patient });
    }
    return () => {
      resetSession();
    };
  }, [patient]);

  if (loading || !patientId) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const session = sessions.find(
    (session) => session.id === Number(encounterId)
  );

  const generateSummary = async (summaryType: keyof AllSummaries) => {
    const toastId = toast.loading("Generating summary...");
    const { success, error } = await generateSummaryNote(
      session!.id,
      session!.transcription,
      summaryType,
      language
    );
    if (success) {
      router.push(
        `?encounter=${
          session!.id
        }&summaryType=${summaryType}&refresh=${Date.now()
          .toString()
          .substring(0, 10)}`
      );
      if (!alreadyGenaretedTypes.includes(summaryType)) {
        setAlreadyGenaretedTypes([...alreadyGenaretedTypes, summaryType]);
      }
      toast.success("Summary generated successfully", { id: toastId });
    } else {
      toast.error(error || "Failed to generate summary", { id: toastId });
    }
  };

  const renderContent = () => {
    if (!session) {
      return (
        <div className="w-full h-full flex justify-center items-center bg-white rounded-[20px] py-[28px] px-[26px]">
          <p className="text-[#2B3674] text-[14px] leading-[20px] font-medium">
            <Translate>Please select an encounter</Translate>
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex sm:flex-row flex-col justify-between gap-3 sm:items-center">
          {/* Notes & Transcript Buttons */}
          <div className="bg-white flex flex-wrap gap-[10px] w-fit h-fit items-center rounded-[30px] p-[10px]">
            <Button
              className={`rounded-[49px] hover:bg-gray-300  font-semibold px-[29.5px] py-[20px] text-[14px] leading-[20px] ${
                activeTab === "notes"
                  ? "bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white"
                  : "bg-[#F4F7FE] text-[#2B3674FA]"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              <Translate>Notes</Translate>
            </Button>
            <Button
              className={`rounded-[49px] hover:bg-gray-300  font-semibold px-[29.5px] py-[20px] text-[14px] leading-[20px] ${
                activeTab === "transcript"
                  ? "bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white"
                  : "bg-[#F4F7FE] text-[#2B3674FA]"
              }`}
              onClick={() => setActiveTab("transcript")}
            >
              <Translate>Transcript</Translate>
            </Button>
          </div>

          <Button
            className="bg-gradient-to-r w-fit sm:ml-0 ml-[10px] from-[#2C6BAC] to-[#38B2AC] text-white rounded-[10px] py-[20px] px-[16px]"
            onClick={() => {
              // if (activeTab === "notes") {
              const editor = getRef(
                activeTab === "notes" ? "notes-mce" : "transcript-mce"
              );
              if (editor) {
                editor.execCommand("mcePrint");
              } else {
                toast.error("Editor not found");
              }
              return;
              // } else {
              // elementToPDF(
              //   "transcript",
              //   `${patient?.name}_Transcript Encounter#${
              //     session.id
              //   } of ${new Date().toDateString()}`
              // );
              // }
            }}
          >
            <Image src="/icons/download.svg" width={18} height={18} alt="" />
            <span className="text-[14px] leading-[20px] font-semibold capitalize">
              <Translate>
                {activeTab === "notes" ? "Export Notes" : "Export Transcript"}
              </Translate>
            </span>
          </Button>
        </div>

        {activeTab === "notes" && (
          <div className="flex flex-wrap items-center gap-[10px] mt-[13px] mb-[20px]">
            <Select
              onValueChange={(value) =>
                router.push(`?encounter=${session.id}&summaryType=${value}`)
              }
              value={summaryType || "SOAP"}
            >
              <SelectTrigger className="bg-white rounded-[10px] border border-[#E2E8F0] min-h-[45px]">
                <SelectValue
                  placeholder={getTranslation("Select Summary Type")}
                />
              </SelectTrigger>
              <SelectContent>
                {alreadyGenaretedTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                generateSummary(value as keyof AllSummaries)
              }
              value={""}
            >
              <SelectTrigger className="bg-white rounded-[10px] border border-[#E2E8F0] min-h-[45px]">
                <SelectValue placeholder={getTranslation("Generate Note")} />
              </SelectTrigger>
              <SelectContent>
                {SummaryTypes.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="flex justify-between items-center w-full"
                  >
                    {alreadyGenaretedTypes.includes(
                      item as keyof AllSummaries
                    ) ? (
                      <RefreshCcw className="text-[#2B3674]" size={12} />
                    ) : (
                      <Plus className="text-[#2B3674]" size={15} />
                    )}
                    <span className="w-full ml-[5px]">{item}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {activeTab === "notes" ? (
          <AiGenerated session={session} generateSummary={generateSummary} />
        ) : (
          <Transcript patient={patient!} session={session} />
        )}
      </div>
    );
  };

  return (
    <div>
      {patient && <UserDetails patient={patient} updatePatient={setPatient} />}
      <div className="grid md:grid-cols-[40%_60%] gap-[17px] mt-[25px]">
        <EncounterHistory sessions={sessions} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
