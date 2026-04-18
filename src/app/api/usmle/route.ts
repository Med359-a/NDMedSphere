import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath, normalizeUrl } from "@/lib/content-utils";
import { type UsmleRow, toUsmleItem } from "@/lib/supabase-content";
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
      .from("usmle_resources")
      .select("id, title, description, url, file_path, file_name, file_type, mime_type, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as UsmleRow[]).map(toUsmleItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load resources." },
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
      description: string;
      url: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        file: (formData.get("file") as File | null) ?? null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as
        | {
            title?: unknown;
            description?: unknown;
            url?: unknown;
          }
        | null;

      body = {
        title: String(json?.title ?? "").trim(),
        description: String(json?.description ?? "").trim(),
        url: String(json?.url ?? "").trim(),
        file: null,
      };
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    if (body.url && !url) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    let filePath: string | null = null;
    let fileType: string | null = null;
    let mimeType: string | null = null;
    let fileName: string | null = null;

    if (body.file && body.file.size > 0) {
      if (body.file.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 100MB)." }, { status: 413 });
      }

      if (body.file.type === "application/pdf") {
        fileType = "pdf";
      } else if (body.file.type.startsWith("image/")) {
        fileType = "image";
      } else {
        return NextResponse.json(
          { error: "Only PDF or Image files are allowed." },
          { status: 415 },
        );
      }

      fileName = body.file.name;
      mimeType = body.file.type || null;
      filePath = buildStoragePath([id], body.file.name || `${id}.file`);
      await uploadStorageObject(STORAGE_BUCKETS.usmleFiles, filePath, body.file);
    }

    const row: UsmleRow = {
      id,
      title: body.title,
      description: body.description || null,
      url: url || null,
      file_path: filePath,
      file_name: fileName,
      file_type: fileType,
      mime_type: mimeType,
      created_at: createdAt,
    };

    const { error } = await getSupabaseAdmin().from("usmle_resources").insert({
      id: row.id,
      title: row.title,
      description: row.description,
      url: row.url,
      file_path: row.file_path,
      file_name: row.file_name,
      file_type: row.file_type,
      mime_type: row.mime_type,
      created_at: row.created_at,
    });

    if (error) {
      if (filePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.usmleFiles, filePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ item: toUsmleItem(row) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create resource." },
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
      .from("usmle_resources")
      .select("id, file_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; file_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await getSupabaseAdmin()
      .from("usmle_resources")
      .delete()
      .eq("id", id);

    if (deleteError) throw new Error(deleteError.message);

    if (row.file_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.usmleFiles, row.file_path);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete resource." },
      { status: 500 },
    );
  }
}
