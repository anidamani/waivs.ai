import { AllSummaries } from "@/gemini/summary-types";
import { supabaseClient } from "@/supabase/client";
import { TablesInsert } from "@/supabase/db-type";
import { getMediaUrl } from "@/supabase/utils";
import { Session } from "@/types";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { convertToAac, getSummary, transcribe } from "./functions";

export async function POST(request: Request) {
  //get audio from formdata
  console.log("[API]:Starting Session Processing");
  const formData = await request.formData();
  const patient_id = formData.get("patient_id")?.toString();
  if (!patient_id)
    return NextResponse.json(
      { error: "No patient ID provided" },
      { status: 400 }
    );
  console.log("[API]:Patient ID provided", patient_id);
  const recording = formData.get("recording") as File;
  if (!recording) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 }
    );
  }
  console.log(
    "[API]:Audio file provided",
    recording.name,
    recording.type,
    (recording.size / 1024 / 1024).toFixed(2) + "mb"
  );
  const buffer = await recording.arrayBuffer();
  let aac: File;
  try {
    aac = await convertToAac(Buffer.from(buffer));
    console.log(
      "[API]:AAC file converted",
      aac.name,
      aac.type,
      (aac.size / 1024 / 1024).toFixed(2) + "mb"
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to convert audio to AAC", stack: error },
      { status: 500 }
    );
  }
  const finalFile = !!aac ? aac : recording;
  //upload audio to supabase storage
  const { data, error } = await supabaseClient.storage
    .from("recordings")
    .upload(`${uuidv4()}.${finalFile.type?.split("/")[1]}`, finalFile);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  console.log("[API]:Audio file uploaded to supabase storage", data);
  const recording_url = getMediaUrl(data.fullPath);
  console.log("[API]:Recording URL", recording_url);
  const language = formData.get("language")?.toString() || "en_US";
  const transcription = await transcribe(new Blob([finalFile]));
  console.log("[API]:Transcription", transcription);
  const format = (formData.get("format")?.toString() ||
    "SOAP") as keyof AllSummaries;
  console.log("[API]:Format", format);
  const transcriptionString = transcription
    .map((t) => `${t.role}: ${t.text}`)
    .join("\n");
  if (!transcription) {
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
  console.log("[API]:Transcription string", transcriptionString);
  const soapSummary = await getSummary(transcriptionString, format, language);
  console.log("[API]:SOAP Summary", soapSummary);
  const session: Partial<Session> = {
    transcription,
    recording_url,
    patient_id: Number(patient_id),
  };
  console.log("[API]:Session", session);
  const { data: sessionData, error: sessionError } = await supabaseClient
    .from("sessions")
    .insert(session as TablesInsert<"sessions">)
    .select()
    .single();
  if (sessionError || !sessionData) {
    return NextResponse.json({ error: sessionError }, { status: 500 });
  }
  console.log("[API]:Session data", sessionData);
  const { data: soapSummaryData, error: soapSummaryError } =
    await supabaseClient
      .from("summaries")
      .insert({
        session_id: sessionData.id,
        type: "SOAP",
        content: soapSummary || "",
      })
      .select()
      .single();
  if (soapSummaryError) {
    return NextResponse.json({ error: soapSummaryError }, { status: 500 });
  }
  console.log("[API]:SOAP Summary data", soapSummaryData);
  await supabaseClient
    .from("patients")
    .update({ last_encounter: new Date().toISOString() })
    .eq("id", Number(patient_id));
  return NextResponse.json({
    success: true,
    id: sessionData.id,
  });
}
