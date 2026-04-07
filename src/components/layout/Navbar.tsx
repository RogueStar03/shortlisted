"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth");
  }

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link
          href="/analyze"
          className="text-sm font-semibold text-gray-900 tracking-tight"
        >
          Short<span className="text-blue-600">listed</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/analyze"
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Analyzer
          </Link>
          <Link
            href="/tracker"
            prefetch={false}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Tracker
          </Link>
          {userEmail && (
            <>
              <Link href="/account" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                {userEmail}
              </Link>
              <button
                onClick={signOut}
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
