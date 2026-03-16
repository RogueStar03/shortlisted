import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  jd_url: string | null;
  jd_text: string | null;
  status: ApplicationStatus;
  applied_at: string;
  notes: string | null;
  reminder_days: number;
  created_at: string;
  updated_at: string;
}

export async function getApplications(): Promise<Application[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createApplication(
  input: Pick<
    Application,
    "company" | "role" | "status" | "applied_at" | "jd_url" | "notes"
  >,
): Promise<Application> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteApplication(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);

  if (error) throw error;
}
