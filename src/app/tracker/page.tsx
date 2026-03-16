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

  // Check plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, plan_expires_at")
    .eq("id", user.id)
    .single();

  const now = new Date();
  const isPack =
    profile?.plan === "pack" &&
    profile?.plan_expires_at &&
    new Date(profile.plan_expires_at) > now;

  // Fetch applications — empty array for free users (paywall shown client side)
  const applications = isPack ? await getApplications() : [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={user.email} />
      <TrackerClient
        initialApplications={applications}
        isPack={isPack ?? false}
      />
    </div>
  );
}
