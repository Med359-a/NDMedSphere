import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath, normalizeUrl, parseTags } from "@/lib/content-utils";
import { type MedicalNewsRow, toStudyItem } from "@/lib/supabase-content";
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
      .from("medical_news")
      .select("id, title, notes, tags, url, image_path, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as MedicalNewsRow[]).map(toStudyItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load notes." },
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
      title: string;
      notes: string;
      tags: string[];
      url: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        tags: parseTags(formData.get("tags")),
        url: String(formData.get("url") ?? "").trim(),
        file: (formData.get("file") as File | null) ?? null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as
        | {
            title?: unknown;
            notes?: unknown;
            tags?: unknown;
            url?: unknown;
          }
        | null;

      body = {
        title: String(json?.title ?? "").trim(),
        notes: String(json?.notes ?? "").trim(),
        tags: parseTags(json?.tags),
        url: String(json?.url ?? "").trim(),
        file: null,
      };
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!body.notes) {
      return NextResponse.json({ error: "Notes are required." }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    if (body.url && !url) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
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
      await uploadStorageObject(STORAGE_BUCKETS.medicalNewsImages, imagePath, body.file);
    }

    const row: MedicalNewsRow = {
      id,
      title: body.title,
      notes: body.notes,
      tags: body.tags,
      url: url || null,
      image_path: imagePath,
      created_at: createdAt,
    };

    const { error } = await getSupabaseAdmin().from("medical_news").insert({
      id: row.id,
      title: row.title,
      notes: row.notes,
      tags: row.tags,
      url: row.url,
      image_path: row.image_path,
      created_at: row.created_at,
    });

    if (error) {
      if (imagePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.medicalNewsImages, imagePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ item: toStudyItem(row) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create note." },
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
      .from("medical_news")
      .select("id, image_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; image_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await getSupabaseAdmin()
      .from("medical_news")
      .delete()
      .eq("id", id);

    if (deleteError) throw new Error(deleteError.message);

    if (row.image_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.medicalNewsImages, row.image_path);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete note." },
      { status: 500 },
    );
  }
}
