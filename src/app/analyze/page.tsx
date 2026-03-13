import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyzeClient from "./AnalyzeClient";
import Navbar from "@/components/layout/Navbar";

export default async function AnalyzePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/analyze");

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={user.email} />
      <AnalyzeClient />
    </div>
  );
}