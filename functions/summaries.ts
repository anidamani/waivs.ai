"use server";

import { getSummary } from "@/app/api/process-session/functions";
import { AllSummaries } from "@/gemini/summary-types";
import { createClient } from "@/supabase/server";
import { Transcription } from "@/types";

export const generateSummaryNote = async (
  sessionId: number,
  transcription: Transcription[],
  summaryType: keyof AllSummaries,
  language: string
) => {
  const summary = await getSummary(
    transcription.map((t) => `${t.role}: ${t.text}`).join("\n"),
    summaryType,
    language
  );
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("summaries")
    .upsert(
      {
        session_id: sessionId,
        type: summaryType,
        content: summary,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id,type" }
    )
    .eq("session_id", sessionId)
    .eq("type", summaryType)
    .select()
    .single();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
};
