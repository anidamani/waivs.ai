import { createClient } from "@/supabase/server";

export const getPatientStats = async (doctor_id: string) => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("patients")
    .select("id", { count: "exact", head: true })
    .eq("doctor_id", doctor_id);
  if (error) {
    console.error(error);
    return 0;
  }
  return count || 0;
};
