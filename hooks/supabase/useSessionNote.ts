"use client";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "@/supabase/client";
import { Database } from "@/supabase/db-type";
import { PostgrestError, RealtimeChannel } from "@supabase/supabase-js";
import useMultipleDocs from "@/supabase/hooks/useMultipleDocs";
import { AllSummaries } from "@/gemini/summary-types";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

type Note = Database["public"]["Tables"]["summaries"]["Row"];
interface UseSessionNoteProps {
  sessionId: number;
  type: keyof AllSummaries;
}

export function useSessionNote({ sessionId, type }: UseSessionNoteProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh");

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("summaries")
      .select("*")
      .eq("session_id", sessionId)
      .eq("type", type)
      .single();
    setNote(data);
    setLoading(false);
    setError(error);
  };

  const updateNote = async (note: Note["content"]) => {
    const toastId = toast.loading("Updating note...");
    const { data, error } = await supabaseClient
      .from("summaries")
      .update({ content: note, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId)
      .eq("type", type)
      .select()
      .single();
    if (error) {
      toast.error("Failed to update note", { id: toastId });
    } else {
      setNote(data);
      toast.success("Note updated successfully", { id: toastId });
    }
  };

  const updateNoteContentLocal = (content: Note["content"]) => {
    setNote({ ...note, content } as Note);
  };

  useEffect(() => {
    fetchRecords();
  }, [type, sessionId, refresh]);

  return {
    note,
    loading,
    error,
    updateNote,
    updateNoteContentLocal,
  };
}

export default useMultipleDocs;
