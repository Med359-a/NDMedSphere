import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath } from "@/lib/content-utils";
import { DOCTOR_NICHES } from "@/lib/site-sections";
import { type DoctorRow, toDoctorItem } from "@/lib/supabase-content";
import {
  getSupabaseAdmin,
  removeStorageObject,
  STORAGE_BUCKETS,
  uploadStorageObject,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("doctors")
      .select("id, name, biography, niche, rating, image_path, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as DoctorRow[]).map(toDoctorItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load doctors." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    let body: {
      name: string;
      biography: string;
      niche: string;
      rating: number;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        name: String(formData.get("name") ?? "").trim(),
        biography: String(formData.get("biography") ?? "").trim(),
        niche: String(formData.get("niche") ?? "").trim(),
        rating: Number(formData.get("rating") ?? 5),
        file: (formData.get("file") as File | null) ?? null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as
        | {
            name?: unknown;
            biography?: unknown;
            niche?: unknown;
            rating?: unknown;
          }
        | null;

      body = {
        name: String(json?.name ?? "").trim(),
        biography: String(json?.biography ?? "").trim(),
        niche: String(json?.niche ?? "").trim(),
        rating: Number(json?.rating ?? 5),
        file: null,
      };
    }

    if (!body.name) {
      return NextResponse.json({ error: "Doctor name is required." }, { status: 400 });
    }

    if (!body.biography) {
      return NextResponse.json({ error: "Biography is required." }, { status: 400 });
    }

    if (!DOCTOR_NICHES.includes(body.niche as (typeof DOCTOR_NICHES)[number])) {
      return NextResponse.json({ error: "A valid niche is required." }, { status: 400 });
    }

    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    let imagePath: string | null = null;

    if (body.file && body.file.size > 0) {
      if (!body.file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
      }

      if (body.file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 10MB)." }, { status: 413 });
      }

      imagePath = buildStoragePath([id], body.file.name || `${id}.image`);
      await uploadStorageObject(STORAGE_BUCKETS.doctorsImages, imagePath, body.file);
    }

    const row: DoctorRow = {
      id,
      name: body.name,
      biography: body.biography,
      niche: body.niche,
      rating: body.rating,
      image_path: imagePath,
      created_at: createdAt,
    };

    const { error } = await getSupabaseAdmin().from("doctors").insert(row);
    if (error) {
      if (imagePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.doctorsImages, imagePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ item: toDoctorItem(row) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create doctor." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing query param 'id'." }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("doctors")
      .select("id, image_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; image_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await getSupabaseAdmin()
      .from("doctors")
      .delete()
      .eq("id", id);

    if (deleteError) throw new Error(deleteError.message);

    if (row.image_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.doctorsImages, row.image_path);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete doctor." },
      { status: 500 },
    );
  }
}
