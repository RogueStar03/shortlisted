import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { log } from "@/lib/log";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const { error } = await supabase
    .from("applications")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    log.error("Failed to update application", { userId: user.id, route: `PATCH /api/applications/${id}`, msg: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  log.info("Application updated", { userId: user.id, route: `PATCH /api/applications/${id}` });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    log.error("Failed to delete application", { userId: user.id, route: `DELETE /api/applications/${id}`, msg: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  log.info("Application deleted", { userId: user.id, route: `DELETE /api/applications/${id}` });
  return NextResponse.json({ success: true });
}
