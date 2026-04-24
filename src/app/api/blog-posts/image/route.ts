import { NextRequest, NextResponse } from "next/server";
import { getStoragePublicUrl, STORAGE_BUCKETS } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing query param 'id'." }, { status: 400 });
  }

  return NextResponse.redirect(getStoragePublicUrl(STORAGE_BUCKETS.medicalNewsImages, id));
}
