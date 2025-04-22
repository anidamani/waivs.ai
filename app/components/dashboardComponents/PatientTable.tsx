"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatientContext } from "@/app/contexts/PatientContext";
import Image from "next/image";
import { CustomerStatus, SESSION_STEPS } from "@/enums";
import AddPatient from "./AddPatient";
import { Search } from "lucide-react";
import NoPatients from "./NoPatients";
import Link from "next/link";
import { useSession } from "@/app/contexts/SessionContext";
import { Patient } from "@/types";
import Loader from "../global/Loader";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { Translate } from "../global/Translate";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { ConfirmationDialog } from "../global/ConfirmationDialog";
export default function PatientTable({
  totalPatients,
}: {
  totalPatients: number;
}) {
  const { patients, deletePatient, loading, error } = usePatientContext();
  const { setIsModalOpen, updateSessionData, setCurrentStep } = useSession();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );
  const { getTranslation } = useTranslation();
  const filteredPatients = patients?.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    const createdAt = new Date(patient.created_at);
    const from = dateFilter?.from;
    const to = dateFilter?.to
      ? new Date(dateFilter.to.setHours(23, 59, 59, 999)) // ✅ include full day
      : undefined;

    const matchesDate = !from || !to || (createdAt >= from && createdAt <= to);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const startSession = async (patient: Patient) => {
    setIsModalOpen(true);
    setCurrentStep(SESSION_STEPS.RECORDING);
    updateSessionData({
      patient,
    });
  };

  console.log("patients", patients);

  return (
    <div className=" sm:p-[20px] xl:p-[32px] mt-[20px] rounded-[20px] md:bg-white">
      <div className="flex sm:flex-row flex-col flex-wrap gap-4 sm:items-center justify-between">
        <h1 className="text-[24px] font-semibold leading-[30px] text-[#2B3674]">
          <Translate>All Patients</Translate>
        </h1>

        {/* Search and Filters */}
        <div className=" grid sm:grid-cols-2 md:flex  gap-4 mb-4">
          {/* Search Input */}
          <div className="flex h-[40px] border pl-3 rounded-[8px] w-full md:min-w-[240px] items-center gap-2">
            <Search />
            <Input
              className="!border-none !outline-none !ring-0"
              placeholder={getTranslation("Search by name")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter Dropdown */}
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="h-[50px] w-full mt-[2px] py-[12px]">
              <SelectValue placeholder={getTranslation("Status")} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <SelectItem value="all">
                <Translate>All</Translate>
              </SelectItem>
              {Object.values(CustomerStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  <Translate>{status}</Translate>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter Input */}
          <div className="lg:w-[300px]  ">
            <DatePickerWithRange
              value={dateFilter}
              onChange={(range) => setDateFilter(range)}
            />
          </div>

          {/* Add Patient Button */}
          <AddPatient />
        </div>
      </div>

      {/* Display Total Patient Count */}
      <p className="text-[16px] mb-[24px] leading-[16px] font-normal text-[#4B5565]">
        {filteredPatients?.length} <Translate>Patients</Translate>
      </p>

      {/* Patient Data Table */}
      {loading ? (
        <div className="flex justify-center items-center h-full min-h-[calc(100vh-440px)]">
          <Loader />
        </div>
      ) : filteredPatients?.length > 0 ? (
        <div key={filteredPatients.length}>
          <Table className=" md:table w-full table-auto hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                  <Translate>Name</Translate>
                </TableHead>
                <TableHead className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                  <Translate>Patient ID</Translate>
                </TableHead>
                <TableHead className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                  <Translate>Last Encounter</Translate>
                </TableHead>
                <TableHead className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                  <Translate>Status</Translate>
                </TableHead>
                <TableHead className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                  <Translate>Action</Translate>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Link
                      href={`/patient/${patient.id}`}
                      className="flex items-center gap-[12px]"
                    >
                      <Image
                        src={
                          patient.image_url
                            ? patient.image_url
                            : "/icons/user.svg"
                        }
                        width={48}
                        height={48}
                        alt={patient.name}
                        className="rounded-full object-cover aspect-square w-12 h-12"
                      />
                      {patient.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/patient/${patient.id}`}>
                      {patient?.patient_id || "-"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/patient/${patient.id}`}>
                      {new Date(patient.last_encounter).toDateString()}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/patient/${patient.id}`}>
                      <Translate>{patient.status}</Translate>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        src="/icons/micButton.svg"
                        onClick={() => startSession(patient)}
                        width={40}
                        height={40}
                        alt=""
                      />
                      {/* Delete Patient Button */}
                      <ConfirmationDialog
                        type="warning"
                        title="Confirm Permanent Deletion"
                        description={`
                          Are you sure you want to permanently delete <b>${patient.name}</b>?
                          <br /><br />
                          All associated records will be permanently removed. <b>This action cannot be undone.</b>
                        `}
                        onConfirm={() => deletePatient(patient.id)}
                      >
                        <Image
                          src="/icons/delete.svg"
                          width={40}
                          height={40}
                          alt=""
                        />
                      </ConfirmationDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Cards View For Small Screens */}
          <div className="flex flex-col gap-[15px] md:hidden">
            {filteredPatients?.map((patient, index) => (
              <div
                className="bg-white rounded-[14px] px-[20px] py-[12px]"
                key={index}
              >
                {/* Header Section */}
                <div className="flex items-center border-b border-[#EEF2F6] pb-[12px] justify-between">
                  <Link
                    href={`/patient/${patient.id}`}
                    className="flex items-center gap-[12px]"
                  >
                    <Image
                      src="/icons/user.svg"
                      width={38}
                      height={38}
                      alt="user"
                    />
                    <div>
                      <h3 className=" font-medium text-[16px] leading-[24px] text-[#2B3674]">
                        {patient.name}
                      </h3>
                      <h4 className=" font-normal text-[14px] leading-[26px] text-[#919AB4]">
                        #{patient.id}
                      </h4>
                    </div>
                  </Link>
                  <div className="flex items-center gap-[12px]">
                    <Image
                      onClick={() => startSession(patient)}
                      src="/icons/micButton.svg"
                      width={34}
                      height={34}
                      alt="mic"
                    />
                    {/* Delete Patient Button */}
                    <ConfirmationDialog
                      type="warning"
                      title="Confirm Permanent Deletion"
                      description={`
                          Are you sure you want to permanently delete <b>${patient.name}</b>?
                          <br /><br />
                          All associated records will be permanently removed. <b>This action cannot be undone.</b>
                        `}
                      onConfirm={() => deletePatient(patient.id)}
                    >
                      <Image
                        src="/icons/delete.svg"
                        width={40}
                        height={40}
                        alt=""
                      />
                    </ConfirmationDialog>
                  </div>
                </div>

                <Link href={`/patient/${patient.id}`}>
                  <div className="flex items-center py-[14px] justify-between">
                    <h3 className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                      <Translate>Last Encounter</Translate>
                    </h3>
                    <h3 className="text-[14px] leading-[16px] font-normal text-[#2B3674]">
                      {" "}
                      {new Date(patient.last_encounter).toDateString()}
                    </h3>
                  </div>
                  <div className="flex items-center py-[14px] justify-between">
                    <h3 className="text-[14px] leading-[20px] font-semibold text-[#2B3674]">
                      <Translate>Appointment</Translate>
                    </h3>
                    <h3 className="text-[14px] leading-[16px] font-normal text-[#2B3674]">
                      <Translate>{patient.status}</Translate>
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoPatients />
      )}
    </div>
  );
}
