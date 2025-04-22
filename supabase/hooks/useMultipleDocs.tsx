"use client";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../client";
import { Database } from "../db-type";
import { PostgrestError, RealtimeChannel } from "@supabase/supabase-js";

interface UseMultipleDocsProps<T> {
  initialData: T;
  queryFn: () => Promise<{
    error: PostgrestError | null;
    data: T;
  }>;
  table: keyof Database["public"]["Tables"];
  filters?: [string, string | number];
  deps?: any[];
  updateHandler?: (data: T, setData: (data: T) => void, prev: T) => void;
}

export function useMultipleDocs<T>({
  initialData,
  queryFn,
  table,
  filters,
  deps,
  updateHandler,
}: UseMultipleDocsProps<T>) {
  const [records, setRecords] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const chanelRef = useRef<RealtimeChannel>(null);

  const subscribeToRecords = async () => {
    const filtersString = `${filters?.[0] as string}=eq.${filters?.[1]}`;
    console.log("Filters string", filtersString);
    chanelRef.current = supabaseClient
      .channel(`${table}-follow-up`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        (payload) => {
          console.log("Payload", payload);
          updateHandler?.(payload.new as T, setRecords, records);
        }
      )
      .subscribe();
  };

  const unsubscribeFromRecords = async () => {
    if (chanelRef.current) {
      await chanelRef.current.unsubscribe();
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await queryFn();
    setRecords(data);
    setLoading(false);
    setError(error);
  };

  useEffect(() => {
    fetchRecords();
    subscribeToRecords();
    return () => {
      unsubscribeFromRecords();
    };
  }, [...(deps || [])]);

  return {
    records,
    loading,
    error,
  };
}

export default useMultipleDocs;
