import { NextRequest, NextResponse } from "next/server";
import { getStoragePublicUrl, getSupabaseAdmin, STORAGE_BUCKETS } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing query param 'id'." }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("videos")
      .select("file_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { file_path: string | null } | undefined;
    if (!row?.file_path) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    return NextResponse.redirect(getStoragePublicUrl(STORAGE_BUCKETS.videos, row.file_path));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stream failed." },
      { status: 500 },
    );
  }
}
