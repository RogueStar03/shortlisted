import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplications } from "@/lib/supabase/applications";
import TrackerClient from "./trackerClient";
import Navbar from "@/components/layout/Navbar";

export default async function TrackerPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/tracker");

  const applications = await getApplications(user.id);

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)" }}>
      <Navbar userEmail={user.email} />
      <TrackerClient initialApplications={applications} />
    </div>
  );
}
