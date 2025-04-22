import { CustomerStatus, Gender, Language } from "./enums";
import { AllSummaries } from "./gemini/summary-types";

type Patient = {
  id: number;
  created_at: Date;
  name: string;
  patient_id?: string;
  status: CustomerStatus;
  email: string;
  last_encounter: Date;
  image_url?: string;
  dob?: Date;
  phone?: string;
  preffered_language?: Language;
  gender?: Gender;
  doctor_id: string;
  diagnosis: string;
};
type Message = {
  id: number;
  sender: string;
  role: "doctor" | "patient";
  time: string;
  text: string;
  avatar: string;
};

type Session = {
  id: number;
  patient_id: number;
  created_at: Date;
  transcription: Transcription[];
  recording_url: string;
};

type NoteFormat = {
  value: string;
  label: string;
  structure: string[];
};

type Transcription = {
  role: "doctor" | "patient";
  text: string;
  startTime: number;
  endTime: number;
};
