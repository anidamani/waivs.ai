"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SESSION_STEPS } from "@/enums";
import { Patient } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "./TranslationContext";
// Define the context type
interface SessionContextType {
  currentStep: SESSION_STEPS;
  setCurrentStep: (step: SESSION_STEPS) => void;
  nextStep: () => void;
  resetSession: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  sessionData: Partial<SessionData>;
  updateSessionData: (data: Partial<SessionData>) => void;
  handleProcessSession: () => void;
  newSessionId: number | null;
}

// Create Context with default values
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Define props type for the provider
interface SessionProviderProps {
  children: ReactNode;
}

interface SessionData {
  patient: Patient;
  format: string;
  recording: File;
}
// Provider Component
export function SessionProvider({ children }: SessionProviderProps) {
  const [currentStep, setCurrentStep] = useState<SESSION_STEPS>(
    SESSION_STEPS.RECORDING
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<Partial<SessionData>>({});
  const [newSessionId, setNewSessionId] = useState<number | null>(null);
  const { language } = useTranslation();
  console.log({ sessionData });

  const updateSessionData = (data: Partial<SessionData>) => {
    setSessionData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    if (isModalOpen === false) {
      resetSession();
    }
  }, [isModalOpen]);

  // Move to next step
  const nextStep = () => {
    setCurrentStep((prev) => {
      const nextSteps = {
        [SESSION_STEPS.RECORDING]: SESSION_STEPS.SESSION_FORMAT,
        [SESSION_STEPS.SESSION_FORMAT]: SESSION_STEPS.FIND_PATIENT,
        [SESSION_STEPS.FIND_PATIENT]: SESSION_STEPS.PREPARE,
        [SESSION_STEPS.PREPARE]: SESSION_STEPS.PREPARE,
      };
      return (
        nextSteps[prev as keyof typeof nextSteps] || SESSION_STEPS.RECORDING
      );
    });
  };

  const handleProcessSession = async () => {
    if (!sessionData.format) {
      toast.error("Please select a session format");
      setCurrentStep(SESSION_STEPS.SESSION_FORMAT);
      return;
    }
    if (!sessionData.patient) {
      toast.error("Please select a patient");
      setCurrentStep(SESSION_STEPS.FIND_PATIENT);
      return;
    }
    if (!sessionData.recording) {
      toast.error("Please upload a recording");
      setCurrentStep(SESSION_STEPS.RECORDING);
      return;
    }
    const { patient, format, recording } = sessionData;
    const formData = new FormData();
    formData.append("patient_id", patient.id.toString());
    formData.append("format", format);
    formData.append("recording", recording);
    formData.append("language", language);
    try {
      const response = await fetch("/api/process-session", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setNewSessionId(data.id);
      setIsModalOpen(false);
      resetSession();
      window.location.href = `/patient/${patient.id}?encounter=${data.id}`;
      toast.success("Session processed successfully");
    } catch (error) {
      console.error("Network or unexpected error processing session:", error);
      toast.error(
        `Error processing session: ${
          (error as any)?.message || "Unknown error"
        }`
      );
    }
  };

  // Reset session to the initial step
  const resetSession = () => {
    setCurrentStep(SESSION_STEPS.RECORDING);
    setIsModalOpen(false);
    setSessionData({});
  };

  return (
    <SessionContext.Provider
      value={{
        setCurrentStep,
        currentStep,
        nextStep,
        resetSession,
        isModalOpen,
        setIsModalOpen,
        sessionData,
        updateSessionData,
        handleProcessSession,
        newSessionId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Custom Hook for consuming context safely
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
