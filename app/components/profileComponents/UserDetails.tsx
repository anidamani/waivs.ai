"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Patient } from "@/types";
import { supabaseClient } from "@/supabase/client";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { Translate } from "../global/Translate";

const UserDetails: React.FC<{
  patient: Patient;
  updatePatient: (patient: Patient) => void;
}> = ({ patient: patientData, updatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient>(patientData);
  const { getTranslation } = useTranslation();

  const handleEditToggle = async () => {
    if (isEditing) {
      const toastId = toast.loading("Updating patient...");
      const { data, error } = await supabaseClient
        .from("patients")
        .update({
          ...patient,
          dob: patient.dob ? new Date(patient.dob).toISOString() : null,
          created_at: new Date().toISOString(),
          last_encounter: new Date(patient.last_encounter).toISOString(),
        })
        .eq("id", patient.id)
        .select()
        .single()
        .overrideTypes<Patient>();
      if (error) {
        console.error(error);
        toast.error("Failed to update patient", { id: toastId });
      } else if (data) {
        updatePatient(data);
        toast.success("Patient updated successfully", { id: toastId });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof Patient, value: string) => {
    setPatient({ ...patient, [field]: value });
  };

  console.log(patient);
  return (
    <div className="bg-white mt-[25px] px-[28px] grid md:grid-cols-[40%_50%_10%] lg:grid-cols-[40%_40%_20%] py-[23px] rounded-[20px]">
      {/* Profile Section */}
      <div>
        <Image
          src={patient.image_url || "/icons/user.svg"}
          width={80}
          height={80}
          alt="profile"
          className="rounded-full object-cover w-20 h-20"
        />
        {isEditing ? (
          <input
            className="text-[#2B3674] font-medium text-[20px] border p-1 rounded"
            value={patient.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          <h3 className="text-[#2B3674] font-medium text-[20px]">
            {patient.name}
          </h3>
        )}
        {patient?.dob && (
          <p className="text-[13px] leading-[24px] font-medium text-[#A3AED0]">
            {new Date(patient?.dob).toDateString()}
          </p>
        )}

        <div className="flex items-center gap-3 mt-[15px]">
          <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px]">
            <Image src="/icons/tick.svg" width={15} height={15} alt="" />
            <span className="font-medium text-[14px] leading-[20px] text-[#38B2AC]">
              <Translate>{patient.status}</Translate>
            </span>
          </div>
          <div className="bg-[#38B2AC14] px-[8.5px] h-[32px] flex gap-2 items-center rounded-[10px]">
            <Image src="/icons/circle.svg" width={15} height={15} alt="" />
            <span className="font-medium text-[14px] leading-[20px] text-[#38B2AC]">
              {patient.preffered_language}
            </span>
          </div>
        </div>
        <div className="md:hidden flex my-4 ">
          <Button
            className="flex items-center hover:bg-gray-300 w-fit justify-end bg-transparent border border-[#E5E5E7] py-[20px] px-[12px] "
            onClick={handleEditToggle}
          >
            <Image src="/icons/edit.svg" width={18} height={18} alt="edit" />
            <span className="text-[14px] leading-[20px] font-medium text-[#2B3674]">
              <Translate>{isEditing ? "Save" : "Edit Profile"}</Translate>
            </span>
          </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid sm:grid-cols-2 gap-x-[25px] gap-y-[17px]">
        {[
          {
            label: getTranslation("Dat of Birth"),
            field: "dob",
            type: "date",
            value: patient?.dob ? new Date(patient?.dob) : null,
          },
          {
            label: getTranslation("Diagnosis"),
            field: "diagnosis",
            type: "text",
            value: patient.diagnosis,
          },
          {
            label: getTranslation("Phone Number"),
            field: "phone",
            type: "text",
            value: patient.phone,
          },
          {
            label: getTranslation("Treatment Date"),
            field: "last_encounter",
            type: "date",
            value: patient.last_encounter,
          },
          {
            label: getTranslation("Email"),
            type: "text",
            value: patient.email,
          },
          {
            label: getTranslation("Health Card ID"),
            field: "patient_id",
            value: patient.patient_id,
          },
        ].map(({ label, field, value, type }, index) => (
          <div key={index}>
            <p className="text-[13px] leading-[24px] font-medium text-[#A3AED0]">
              {label}
            </p>
            {isEditing ? (
              <input
                className="text-[14px] font-medium border p-1 rounded w-full"
                type={type}
                value={
                  value
                    ? value instanceof Date
                      ? new Date(value).toISOString().slice(0, 10)
                      : value
                    : "N/A"
                }
                onChange={(e) =>
                  handleChange(field as keyof Patient, e.target.value)
                }
              />
            ) : (
              <h1 className="text-[14px] font-medium">
                {value
                  ? value instanceof Date
                    ? value?.toDateString() ?? "N/A"
                    : value ?? "N/A"
                  : "N/A"}
              </h1>
            )}
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <div className=" hidden md:flex justify-end ">
        <Button
          className="flex items-center hover:bg-gray-300 w-fit justify-end bg-transparent border border-[#E5E5E7] py-[20px] px-[12px] "
          onClick={handleEditToggle}
        >
          {isEditing ? (
            <Save color="#2B3674" />
          ) : (
            <Image src="/icons/edit.svg" width={18} height={18} alt="edit" />
          )}
          <span className="text-[14px] leading-[20px] font-medium text-[#2B3674]">
            <Translate>{isEditing ? "Save" : "Edit Profile"}</Translate>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default UserDetails;
