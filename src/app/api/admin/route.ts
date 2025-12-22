import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { isAdmin: isAdminRequest(request) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

