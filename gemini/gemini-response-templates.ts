import { AllSummaries } from "./summary-types";

export const NOTE_TEMPLATES = [
  {
    id: 2,
    provider_id: null,
    name: "SOAP Note",
    description:
      "Subjective, Objective, Assessment, Plan structure for general medical visits",
    prompt:
      "Generate SOAP note from this transcript. Include:\n- Subjective: Patient-reported symptoms, history\n- Objective: Vital signs, exam findings, test results\n- Assessment: Diagnosis/differential\n- Plan: Treatment and follow-up",
    example: {
      sections: ["Subjective", "Objective", "Assessment", "Plan"],
      requiredFields: {
        Plan: ["Medications", "FollowUp"],
        Objective: ["Vitals", "Exam"],
        Assessment: ["Diagnosis"],
        Subjective: ["HPI", "ROS"],
      },
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
  {
    id: 3,
    provider_id: null,
    name: "APSO Note",
    description: "Assessment-first structure for quick documentation",
    prompt:
      "Create APSO note with:\n- Leading Assessment for quick reference\n- Concise Plan items\n- Subjective/Objective supporting details",
    example: {
      sectionOrder: ["Assessment", "Plan", "Subjective", "Objective"],
      planComponents: ["Medications", "Referrals", "Education"],
      assessmentComponents: ["PrimaryDiagnosis", "Differentials"],
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
  {
    id: 4,
    provider_id: null,
    name: "Progress Note",
    description: "Chronic condition follow-up template",
    prompt:
      "Generate progress note focusing on:\n- Current status of chronic condition\n- Medication effectiveness\n- Vital trends\n- Plan adjustments",
    example: {
      metrics: ["BP", "A1C", "LDL"],
      sections: [
        "HPIUpdate",
        "VitalTrends",
        "MedicationReview",
        "PlanAdjustments",
      ],
      adjustmentFields: ["DosageChanges", "NewMedications"],
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
  {
    id: 5,
    provider_id: null,
    name: "H&P Note",
    description: "Comprehensive history and physical exam documentation",
    prompt:
      "Generate complete H&P note including:\n- Chief Complaint\n- HPI with OLDCARTS format\n- PMH/PSH/FH/SH\n- Review of Systems\n- Physical Exam findings\n- Assessment and Plan",
    example: {
      sections: ["CC", "HPI", "PMH", "PSH", "FH", "SH", "ROS", "PE", "A/P"],
      requiredElements: {
        HPI: [
          "Onset",
          "Location",
          "Duration",
          "Characteristics",
          "Aggravating",
          "Relieving",
          "Timing",
          "Severity",
        ],
        ROS: [
          "Constitutional",
          "HEENT",
          "Cardiovascular",
          "Respiratory",
          "GI",
          "GU",
          "Musculoskeletal",
          "Neurological",
          "Psychiatric",
          "Endocrine",
          "Hematologic",
          "Allergic",
        ],
      },
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
  {
    id: 6,
    provider_id: null,
    name: "Referral Note",
    description: "Specialist referral documentation",
    prompt:
      "Create referral note containing:\n- Clear reason for referral\n- Relevant clinical history\n- Summary of prior workup\n- Specific questions for specialist\n- Patient demographics and insurance info",
    example: {
      attachments: ["LabResults", "ImagingReports"],
      requiredFields: [
        "ReferringProvider",
        "Specialty",
        "Reason",
        "ClinicalSummary",
        "Questions",
      ],
      insuranceInfoRequired: true,
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
  {
    id: 7,
    provider_id: null,
    name: "Discharge Summary",
    description: "Hospital discharge documentation",
    prompt:
      "Generate discharge summary including:\n- Admission diagnosis\n- Hospital course summary\n- Discharge medications\n- Follow-up instructions\n- Pending test results",
    example: {
      sections: [
        "AdmissionDiagnosis",
        "HospitalCourse",
        "DischargeMeds",
        "FollowUpPlan",
        "PendingResults",
      ],
      requiredElements: {
        FollowUpPlan: ["Provider", "Timing", "Purpose"],
        DischargeMeds: ["Name", "Dose", "Frequency", "Duration"],
      },
    },
    created_at: "2025-03-17 11:50:17.692445+00",
    updated_at: "2025-03-17 11:50:17.692445+00",
    system_template: true,
  },
];

export const exampleNotesOutput: AllSummaries = {
  SOAP: {
    Plan: { Medications: "string", "Follow Up": "string" },
    Objective: { Vitals: "string", Exam: "string" },
    Assessment: { Diagnosis: "string" },
    Subjective: { HPI: "string", ROS: "string" },
  },
  APSO: {
    Assessment: {
      "Primary Diagnosis": "string",
      Differentials: "string",
    },
    Plan: {
      Medications: "string",
      Referrals: "string",
      Education: "string",
    },
    Subjective: "string",
    Objective: "string",
  },
  Progress: {
    "HPI Update": "string",
    "Vital Trends": { BP: "string", A1C: "string", LDL: "string" },
    "Medication Review": "string",
    "Plan Adjustments": {
      "Dosage Changes": "string",
      "New Medications": "string",
    },
  },
  HAndP: {
    CC: "Abdominal Pain",
    HPI: {
      Onset: "string",
      Location: "string",
      Duration: "string",
      Characteristics: "string",
      Aggravating: "string",
      Relieving: "string",
      Timing: "string",
      Severity: "string",
    },
    PMH: "string",
    PSH: "string",
    FH: "string",
    SH: "string",
    ROS: {
      Constitutional: "string",
      HEENT: "string",
      Cardiovascular: "string",
      Respiratory: "string",
      GI: "string",
      GU: "string",
      Musculoskeletal: "string",
      Neurological: "string",
      Psychiatric: "string",
      Endocrine: "string",
      Hematologic: "string",
      Allergic: "string",
    },
    PE: "string",
    "A/P": "string",
  },
  Referral: {
    "Referring Provider": "string",
    Specialty: "string",
    Reason: "string",
    ClinicalSummary: "string",
    Questions: "string",
    InsuranceInfo: "string",
    Attachments: {
      LabResults: "string",
      ImagingReports: "string",
    },
  },
  Discharge: {
    "Admission Diagnosis": "string",
    "Hospital Course": "string",
    "Discharge Meds": [
      {
        Name: "string",
        Dose: "string",
        Frequency: "string",
        Duration: "string",
      },
    ],
    "Follow Up Plan": {
      Provider: "string",
      Timing: "string",
      Purpose: "string",
    },
    "Pending Results": "string",
  },
};

export const notesTemplatesPrompt = {
  SOAP: `
    Generate SOAP note from this transcript. Include:
       - Subjective: Patient-reported symptoms, history
       - Objective: Vital signs, exam findings, test results
       - Assessment: Diagnosis/differential
       - Plan: Treatment and follow-up
 
       ${JSON.stringify(exampleNotesOutput.SOAP)}
    `,

  APSO: `
    Create APSO note from this transcript. Include:
       - Assessment: Primary diagnosis and differentials
       - Plan: Medications, referrals, and patient education
       - Subjective: Patient's reported symptoms or concerns
       - Objective: Relevant exam findings or vitals
 
       ${JSON.stringify(exampleNotesOutput.APSO)}
    `,

  Progress: `
    Generate progress note from this transcript. Include:
       - HPIUpdate: Updates on chronic condition and symptoms
       - VitalTrends: Trends in vitals such as BP, A1C, LDL
       - MedicationReview: Current medications and effectiveness
       - PlanAdjustments: Any treatment changes or new medications
 
       ${JSON.stringify(exampleNotesOutput.Progress)}
    `,

  HAndP: `
    Generate complete H&P note from this transcript. Include:
       - Chief Complaint
       - HPI using OLDCARTS: Onset, Location, Duration, Characteristics, Aggravating, Relieving, Timing, Severity
       - PMH, PSH, FH, SH
       - Review of Systems: All body systems
       - Physical Exam findings
       - Assessment and Plan
 
       ${JSON.stringify(exampleNotesOutput.HAndP)}
    `,

  Referral: `
    Create referral note from this transcript. Include:
       - Referring provider details
       - Specialty referred to
       - Reason for referral
       - Clinical summary of history and prior workup
       - Specific questions for the specialist
       - Patient demographics and insurance info
 
       ${JSON.stringify(exampleNotesOutput.Referral)}
    `,

  Discharge: `
    Generate discharge summary from this transcript. Include:
       - Admission diagnosis
       - Summary of hospital course
       - Discharge medications
       - Follow-up plan
       - Any pending results
 
       ${JSON.stringify(exampleNotesOutput.Discharge)}
    `,
};
