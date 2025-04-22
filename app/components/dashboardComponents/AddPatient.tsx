"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { CustomerStatus, Language } from "@/enums";
import { usePatientContext } from "@/app/contexts/PatientContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { supabaseClient } from "@/supabase/client";
import { Patient } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Translate } from "../global/Translate";
import { Database } from "@/supabase/db-type";
import { useRouter } from "next/navigation";

type InsertPatient = Database["public"]["Tables"]["patients"]["Insert"];

const initialPatient: InsertPatient = {
  name: "",
  preffered_language: Language.ENGLISH,
  status: CustomerStatus.ACTIVE,
  doctor_id: "",
};

export default function AddPatient() {
  const { addPatient } = usePatientContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useUser();
  const [newPatient, setNewPatient] = useState<InsertPatient>(initialPatient);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Add patient function
  const handleAddPatient = async () => {
    if (!user?.id) {
      toast.error("Please login to add a patient");
      return;
    }
    const taostId = toast.loading("Adding patient...");
    if (!newPatient.name) {
      toast.error("Name is required", { id: taostId });
      return;
    }
    let image_url = "";
    if (selectedFile) {
      const { data, error } = await supabaseClient.storage
        .from("images")
        .upload(`${uuidv4()}.${selectedFile.type.split("/")[1]}`, selectedFile);
      if (error) {
        toast.error(error.message, { id: taostId });
        return;
      }
      console.log(data);
      image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
    }
    const { data, error } = await supabaseClient
      .from("patients")
      .insert({
        ...newPatient,
        ...(image_url && { image_url }),
        doctor_id: user?.id,
        ...(newPatient?.dob && {
          dob: new Date(newPatient.dob)?.toISOString(),
        }),
      })
      .select("*")
      .single()
      .overrideTypes<Patient>();

    if (error) {
      toast.error(error.message, { id: taostId });
    } else {
      toast.success("Patient added successfully", { id: taostId });
      addPatient(data);
      setShowModal(false);
      setNewPatient(initialPatient);
      router.push(`/patient/${data.id}`);
    }
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        setShowModal(open);
        setSelectedFile(null);
        setNewPatient({ ...initialPatient, doctor_id: user?.id! });
      }}
    >
      <DialogTrigger asChild>
        <button className="text-gradient  flex items-center justify-center gap-[5px] rounded-[8px] text-[14px] leading-[20px] font-semibold border border-[#2C6BAC] py-[10px] px-[20px] flex-shrink-0 cursor-pointer">
          <Translate>Add Patient</Translate>
          <Image src="/icons/plus.svg" width={16} height={16} alt="plus" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674] font-semibold text-[20px] leading-[32px] ">
            <Translate>Add New Patient</Translate>
          </DialogTitle>
          <p className="text-[#A3AED0] font-normal text-[16px] sm:max-w-[80%] leading-[24px]">
            <Translate>
              Reach out to us with any question you have and we'll do our best
              to get back to you.
            </Translate>
          </p>
        </DialogHeader>

        {/* Patient Profile Image Upload */}
        <div className="mx-auto h-[200px] min-w-[200px] max-w-[585px] bg-[#fafcfe] rounded-[13px] border-dashed border-2 border-[#E0E5F2] flex flex-col justify-center items-center relative">
          <Input
            className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {!selectedFile ? (
            <div className="text-center flex justify-center items-center flex-col px-[35px]">
              <Image
                src="/icons/upload.svg"
                width={30}
                height={30}
                alt="Upload Icon"
              />
              <p className="text-[#2B3674] text-[16px] font-semibold leading-[32px] mt-[10px]">
                Upload Profile
              </p>
              <p className="text-[#A0AEC0] leading-[20px] text-[12px]">
                PNG, JPG, and GIF files are allowed
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full w-[100px] h-[100px] object-cover"
              />
            </div>
          )}
        </div>

        {/* Form Fields for New Patient */}
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Name (Required)
          </h2>
          <Input
            name="name"
            required
            className="border border-[#E0E5F2] py-[12px] px-[14px] rounded-[10px]"
            placeholder="Enter Full Name"
            value={newPatient.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Health Card ID (Optional)
          </h2>
          <Input
            name="patient_id"
            required
            className="border border-[#E0E5F2] py-[12px] px-[14px] rounded-[10px]"
            placeholder="Enter Health Card ID"
            value={newPatient.patient_id || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Email (Optional)
          </h2>
          <Input
            name="email"
            required
            className="border border-[#E0E5F2] py-[12px] px-[14px] rounded-[10px]"
            placeholder="Enter Email"
            value={newPatient.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Date Of Birth (Optional)
          </h2>
          <Input
            type="date"
            name="dob"
            className="border border-[#E0E5F2] py-[12px] px-[14px] rounded-[10px]"
            placeholder="Date of Birth"
            value={
              newPatient.dob
                ? new Date(newPatient.dob).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setNewPatient({
                ...newPatient,
                dob: new Date(e.target.value).toISOString(),
              })
            }
          />
        </div>
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Contact (Optional)
          </h2>
          <Input
            name="phone"
            className="border border-[#E0E5F2] py-[12px] px-[14px] rounded-[10px]"
            placeholder="Enter number"
            value={newPatient.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2 className="text-[#2B3674] text-[15px] leading-[22px] mb-[8px] font-medium">
            Preferred Language (Optional)
          </h2>
          <Select
            value={newPatient.preffered_language || ""}
            onValueChange={(value) =>
              setNewPatient({
                ...newPatient,
                preffered_language: value as Language,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Language).map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Patient Button */}
        <Button
          disabled={newPatient?.name === ""}
          className=" h-[40px]  bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] py-[8px] font-semibold text-[15px] leading-[22px]"
          onClick={handleAddPatient}
        >
          Add Patient
        </Button>
      </DialogContent>
    </Dialog>
  );
}
