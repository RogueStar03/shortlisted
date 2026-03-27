import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export const metadata = { title: "Account — Shortlisted" };

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, plan_expires_at, created_at")
    .eq("id", user.id)
    .single();

  const now = new Date();
  const isPack =
    profile?.plan === "pack" &&
    profile?.plan_expires_at &&
    new Date(profile.plan_expires_at) > now;

  const expiryDate = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : null;

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : null;

  // Derive display name from email — "abhishek@gmail.com" → "Abhishek"
  const displayName =
    user.email
      ?.split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "User";

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={user.email} />

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold text-gray-900">Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your profile and plan details.
          </p>
        </div>

        {/* Profile card */}
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 mb-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-semibold text-base">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Joined date */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-xs font-medium text-gray-500">
              Member since
            </span>
            <span className="text-xs text-gray-700">{joinedDate ?? "—"}</span>
          </div>

          {/* Auth provider */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-xs font-medium text-gray-500">
              Signed in with
            </span>
            <span className="text-xs text-gray-700">
              {user.app_metadata?.provider === "google"
                ? "Google"
                : "Email & Password"}
            </span>
          </div>
        </div>

        {/* Plan card */}
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 mb-6">
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Current plan
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isPack
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              {isPack ? "Placement Pack" : "Free"}
            </span>
          </div>

          {isPack && expiryDate && (
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Access until
              </span>
              <span className="text-xs text-gray-700">{expiryDate}</span>
            </div>
          )}

          {!isPack && (
            <div className="px-6 py-5">
              <p className="text-xs text-gray-500 mb-3">
                Upgrade to get the application tracker, follow-up reminders, and
                analytics.
              </p>
              <Link
                href="/#pricing"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Get Placement Pack →
              </Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100">
          <Link
            href="/analyze"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-xs font-medium text-gray-700">
              Resume Analyzer
            </span>
            <span className="text-gray-300 group-hover:text-gray-500 text-sm">
              →
            </span>
          </Link>

          {isPack && (
            <Link
              href="/tracker"
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xs font-medium text-gray-700">
                Application Tracker
              </span>
              <span className="text-gray-300 group-hover:text-gray-500 text-sm">
                →
              </span>
            </Link>
          )}

          <Link
            href="/privacy"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-xs font-medium text-gray-500">
              Privacy Policy
            </span>
            <span className="text-gray-300 group-hover:text-gray-500 text-sm">
              →
            </span>
          </Link>

          <Link
            href="/terms"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-xs font-medium text-gray-500">
              Terms of Service
            </span>
            <span className="text-gray-300 group-hover:text-gray-500 text-sm">
              →
            </span>
          </Link>
        </div>

        {/* Version note */}
        <p className="mt-8 text-center text-xs text-gray-300">
          Shortlisted - Built to get you shortlisted
        </p>
      </main>
    </div>
  );
}
