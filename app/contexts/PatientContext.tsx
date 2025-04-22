// PatientContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AppointmentStatus } from "@/enums";
import type { Patient } from "@/types";
import { supabaseClient } from "@/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

// Define the type for the context state
interface PatientContextType {
  patients: Patient[];
  addPatient: (newPatient: Patient) => void;
  deletePatient: (id: number) => void;
  loading: boolean;
  error: string | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const { user } = useUser();
  const addPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };

  const deletePatient = async (id: number) => {
    const isDeleted = await deletePatientDoc(id);
    if (isDeleted) {
      setPatients(patients.filter((patient) => patient.id !== id));
      toast.success("Patient deleted successfully");
    } else {
      toast.error("Failed to delete patient, please try again");
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await getPaginatedPatients(user.id, 1, 10);
      setError(error?.message);
      if (data) {
        setPatients(data);
      }
      setLoading(false);
    };
    fetchPatients();
  }, [user]);

  return (
    <PatientContext.Provider
      value={{ patients, addPatient, deletePatient, loading, error }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Custom hook to use PatientContext
export const usePatientContext = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
};

export const getPaginatedPatients = async (
  doctor_id: string,
  page: number,
  pageSize: number
) => {
  const response = await supabaseClient
    .from("patients")
    .select("*", { count: "exact" })
    .eq("doctor_id", doctor_id)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .overrideTypes<Patient[]>();
  return response;
};

export const deletePatientDoc = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("patients")
    .delete()
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
};
