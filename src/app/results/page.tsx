import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ResultsClient from "./ResultsClient";
import Navbar from "@/components/layout/Navbar";

export default async function ResultsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/results");

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={user.email} />
      <ResultsClient />
    </div>
  );
}