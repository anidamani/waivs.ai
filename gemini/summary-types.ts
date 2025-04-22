export type SOAPNote = {
  Plan: {
    Medications: string;
    "Follow Up": string;
  };
  Objective: {
    Vitals: string;
    Exam: string;
  };
  Assessment: {
    Diagnosis: string;
  };
  Subjective: {
    HPI: string;
    ROS: string;
  };
};

export type APSONote = {
  Assessment: {
    "Primary Diagnosis": string;
    Differentials: string;
  };
  Plan: {
    Medications: string;
    Referrals: string;
    Education: string;
  };
  Subjective: string;
  Objective: string;
};

export type ProgressNote = {
  "HPI Update": string;
  "Vital Trends": {
    BP: string;
    A1C: string;
    LDL: string;
  };
  "Medication Review": string;
  "Plan Adjustments": {
    "Dosage Changes": string;
    "New Medications": string;
  };
};

export type HandPNote = {
  CC: string;
  HPI: {
    Onset: string;
    Location: string;
    Duration: string;
    Characteristics: string;
    Aggravating: string;
    Relieving: string;
    Timing: string;
    Severity: string;
  };
  PMH: string;
  PSH: string;
  FH: string;
  SH: string;
  ROS: {
    Constitutional: string;
    HEENT: string;
    Cardiovascular: string;
    Respiratory: string;
    GI: string;
    GU: string;
    Musculoskeletal: string;
    Neurological: string;
    Psychiatric: string;
    Endocrine: string;
    Hematologic: string;
    Allergic: string;
  };
  PE: string;
  "A/P": string;
};

export type ReferralNote = {
  "Referring Provider": string;
  Specialty: string;
  Reason: string;
  ClinicalSummary: string;
  Questions: string;
  InsuranceInfo: string;
  Attachments: {
    LabResults: string;
    ImagingReports: string;
  };
};

export type DischargeSummary = {
  "Admission Diagnosis": string;
  "Hospital Course": string;
  "Discharge Meds": Array<{
    Name: string;
    Dose: string;
    Frequency: string;
    Duration: string;
  }>;
  "Follow Up Plan": {
    Provider: string;
    Timing: string;
    Purpose: string;
  };
  "Pending Results": string;
};

export type AllSummaries = {
  SOAP: SOAPNote;
  APSO: APSONote;
  Progress: ProgressNote;
  HAndP: HandPNote;
  Referral: ReferralNote;
  Discharge: DischargeSummary;
};

export const SummaryTypes = [
  "SOAP",
  "APSO",
  "Progress",
  "HAndP",
  "Referral",
  "Discharge",
];

export const SummaryTypeDetails = [
  {
    value: "SOAP",
    label: "Subjective, Objective, Assessment, Plan Format",
    structure: {
      S: "Subjective - Patient-reported symptoms, history",
      O: "Objective - Vital signs, exam findings, test results",
      A: "Assessment - Diagnosis/differential",
      P: "Plan - Treatment and follow-up",
    },
  },
  {
    value: "APSO",
    label: "Assessment, Plan, Subjective, Objective Format",
    structure: {
      A: "Assessment - Primary diagnosis and differentials",
      P: "Plan - Medications, referrals, and patient education",
      S: "Subjective - Patient's reported symptoms or concerns",
      O: "Objective - Relevant exam findings or vitals",
    },
  },
  {
    value: "Progress",
    label: "Progress Note Format",
    structure: {
      HPI: "Updates on chronic condition and symptoms",
      VT: "Trends in vitals such as BP, A1C, LDL",
      MR: "Current medications and effectiveness",
      PA: "Any treatment changes or new medications",
    },
  },
  {
    value: "HAndP",
    label: "History and Physical Format",
    structure: {
      CC: "Chief Complaint",
      HPI: "Onset, Location, Duration, Characteristics, Aggravating, Relieving, Timing, Severity",
      PMH: "Past Medical History",
      PSH: "Past Surgical History",
      FH: "Family History",
      SH: "Social History",
      ROS: "Review of Systems: All body systems",
      PE: "Physical Examination",
      "A/P": "Assessment and Plan",
    },
  },
  {
    value: "Referral",
    label: "Referral Note Format",
    structure: {
      RP: "Referring provider details",
      SP: "Specialty referred to",
      R: "Reason for referral",
      CS: "Clinical summary of history and prior workup",
      SQ: "Specific questions for the specialist",
      PI: "Patient demographics and insurance info",
    },
  },
  {
    value: "Discharge",
    label: "Discharge Summary Format",
    structure: {
      AD: "Admission Diagnosis",
      HC: "Hospital Course",
      DM: "Discharge Medications",
      FP: "Follow Up Plan",
      PR: "Pending Results",
    },
  },
];
