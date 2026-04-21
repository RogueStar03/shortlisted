import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { log } from "@/lib/log";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("applications")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) {
    log.error("Failed to create application", { userId: user.id, route: "POST /api/applications", msg: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  log.info("Application created", { userId: user.id, route: "POST /api/applications" });
  return NextResponse.json(data);
}
