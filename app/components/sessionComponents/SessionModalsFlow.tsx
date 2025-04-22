import { useSession } from "@/app/contexts/SessionContext";
import React from "react";
import VoiceRecorder from "./VoiceRecorder";
import { SESSION_STEPS } from "@/enums";
import SummaryType from "./SummaryType";
import PreparingSession from "./PreparingSession";
import PatientSearch from "./PatientSearch";

const SessionModalsFlow = () => {
  const { isModalOpen, currentStep } = useSession();

  if (!isModalOpen) return null;
  return (
    <div>
      {currentStep === SESSION_STEPS.RECORDING && <VoiceRecorder />}

      {currentStep === SESSION_STEPS.SESSION_FORMAT && <SummaryType />}

      {currentStep === SESSION_STEPS.FIND_PATIENT && <PatientSearch />}

      {currentStep === SESSION_STEPS.PREPARE && <PreparingSession />}
    </div>
  );
};

export default SessionModalsFlow;
