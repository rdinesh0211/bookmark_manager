import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const supabaseServer = getSupabaseServerClient();

  const { error } = await supabaseServer.from("bookmarks").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Could not delete bookmark. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
