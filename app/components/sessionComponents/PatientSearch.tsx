"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { Patient } from "@/types";
import AddPatient from "../dashboardComponents/AddPatient";
import { useSession } from "@/app/contexts/SessionContext";
import { supabaseClient } from "@/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useDebounce } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import { Translate } from "../global/Translate";
import { useTranslation } from "@/app/contexts/TranslationContext";
export default function PatientSearch() {
  const user = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { getTranslation } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const {
    setIsModalOpen,
    nextStep,
    updateSessionData,
    handleProcessSession,
    sessionData,
  } = useSession();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.user?.id || !debouncedSearchTerm) return;
      const { data, error } = await supabaseClient
        .from("patients")
        .select("name, id, image_url, last_encounter")
        .eq("doctor_id", user?.user?.id)
        .textSearch("name", debouncedSearchTerm)
        .order("last_encounter", { ascending: false })
        .overrideTypes<Patient[]>();
      if (error) {
        console.log(error);
      } else {
        setPatients(data);
      }
    };
    fetchPatients();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (sessionData.patient) {
      setSelectedPatient(sessionData.patient);
      nextStep();
      handleProcessSession();
    }
  }, [sessionData.patient]);

  const handleAddPatient = async () => {
    if (!user?.user?.id) return;
    const toastId = toast.loading("Adding patient...");
    const { data, error } = await supabaseClient
      .from("patients")
      .insert({ name: searchTerm, doctor_id: user?.user?.id, email: "" })
      .select("*")
      .single()
      .overrideTypes<Patient>();
    if (error) {
      console.log(error);
      toast.error(error.message, { id: toastId });
    } else {
      setSelectedPatient(data);
      updateSessionData({ patient: data });
      setSearchTerm("");
      toast.success("Patient added: " + data.id, { id: toastId });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className=" sm:min-w-[585px] min-h-[348px]">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674] font-semibold text-[20px] leading-[32px]">
            <Translate>Thanks for healing another human</Translate>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 relative">
          <p className="text-[#2B3674] font-medium text-[15px] leading-[22px] ">
            <Translate>Who was the patient for this visit?</Translate>
          </p>
          {/* Search Input */}
          <div className="flex items-center justify-between py-[14px] px-[10px] sm:px-[20px] border-2 border-[#EEF2F6] rounded-[8px]">
            <div className="flex items-center gap-[12px] w-full">
              <Search />
              {selectedPatient ? (
                <div className="flex items-center justify-between w-fit py-[5px] px-[9px] border border-[#EEF2F6] rounded-full gap-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <Image
                      className="rounded-full"
                      src={selectedPatient?.image_url || "/icons/user.svg"}
                      width={24}
                      height={24}
                      alt="profile"
                    />
                    <h1 className=" font-normal text-[14px] leading-[24px] text-[#2B3674]">
                      {selectedPatient?.name}
                    </h1>
                  </div>
                  <Image
                    onClick={() => setSelectedPatient(null)}
                    src="/icons/cross.svg"
                    width={10}
                    height={10}
                    alt="cross"
                  />
                </div>
              ) : (
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={getTranslation("Patient Name or ID")}
                  className="w-full outline-none"
                />
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Image src="/icons/bulb.svg" width={20} height={20} alt="" />
            <p className=" font-normal text-[12px] leading-[18px] text-[#A3AED0]">
              <Translate>
                Tip: Enter the patient's name before starting the visit to
                access patient summaries and get more accurate notes.
              </Translate>
            </p>
          </div>

          {/* Dropdown with Matching Formats */}
          {searchTerm.length > 0 && (
            <div className="bg-white absolute w-full top-28 custom-shadow2 rounded-[14px] px-[20px] py-[15px] flex flex-col gap-[10px]">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="cursor-pointer p-2 rounded hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedPatient(patient);
                      updateSessionData({ patient: patient });
                      setSearchTerm("");
                    }}
                  >
                    <div className="flex items-center gap-[8px]">
                      <Image
                        className="rounded-full"
                        src={patient.image_url || "/icons/user.svg"}
                        width={48}
                        height={48}
                        alt="profile"
                      />
                      <div>
                        <h1 className=" font-normal text-[16px] leading-[24px] text-[#2B3674]">
                          {patient.name}
                        </h1>
                        <h2 className="text-[12px] leading-[18px] font-medium text-[#A3AED0]">
                          Last Session:{" "}
                          {patient?.last_encounter
                            ? new Date(
                                patient?.last_encounter
                              ).toLocaleDateString()
                            : "N/A"}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // New Patient
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <Image
                      className="rounded-full"
                      src={"/icons/user.svg"}
                      width={48}
                      height={48}
                      alt="profile"
                    />
                    <div>
                      <h1 className=" font-normal text-[16px] leading-[24px] text-[#2B3674]">
                        {searchTerm}
                      </h1>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] rounded-[10px] py-[22px] text-white cursor-pointer"
                    onClick={handleAddPatient}
                  >
                    <Translate>Add Patient</Translate>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          <Button
            className="w-full bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] rounded-[10px] py-[22px] text-white"
            onClick={() => {
              nextStep();
              handleProcessSession();
            }}
          >
            <Translate>Continue</Translate>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
