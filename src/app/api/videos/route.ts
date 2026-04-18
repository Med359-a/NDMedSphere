import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath, normalizeUrl } from "@/lib/content-utils";
import type { VideoItem } from "@/lib/video-types";
import { type VideoRow, toVideoItem } from "@/lib/supabase-content";
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
      .from("videos")
      .select("id, title, description, youtube_url, file_path, original_name, mime_type, size, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as VideoRow[]).map(toVideoItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load videos." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const rawYoutubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
    const youtubeUrl = normalizeUrl(rawYoutubeUrl);

    if (rawYoutubeUrl && !youtubeUrl) {
      return NextResponse.json({ error: "Invalid YouTube URL." }, { status: 400 });
    }

    const candidates = formData.getAll("files");
    const single = formData.get("file");
    const entries = candidates.length ? candidates : single ? [single] : [];
    const files = entries.filter((value): value is File => value instanceof File);

    if (files.length === 0 && !youtubeUrl) {
      return NextResponse.json(
        { error: "No files or YouTube URL found." },
        { status: 400 },
      );
    }

    const created: VideoItem[] = [];
    const batchCreatedAt = new Date().toISOString();

    if (youtubeUrl) {
      const row: VideoRow = {
        id: crypto.randomUUID(),
        title: title || "YouTube Video",
        description,
        youtube_url: youtubeUrl,
        file_path: null,
        original_name: null,
        mime_type: null,
        size: null,
        created_at: batchCreatedAt,
      };

      const { error } = await supabase.from("videos").insert({
        id: row.id,
        title: row.title,
        description: row.description,
        youtube_url: row.youtube_url,
        file_path: row.file_path,
        original_name: row.original_name,
        mime_type: row.mime_type,
        size: row.size,
        created_at: row.created_at,
      });

      if (error) throw new Error(error.message);
      created.push(toVideoItem(row));
    }

    const maxBytes = 250 * 1024 * 1024;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];

      if (!file.type.startsWith("video/")) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type || "unknown"}` },
          { status: 415 },
        );
      }

      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File too large. Max is ${maxBytes} bytes.` },
          { status: 413 },
        );
      }

      const id = crypto.randomUUID();
      const resolvedTitle =
        files.length > 1 ? (title ? `${title} (${i + 1})` : file.name) : title || file.name;
      const filePath = buildStoragePath([id], file.name || `${id}.video`);

      await uploadStorageObject(STORAGE_BUCKETS.videos, filePath, file);

      const row: VideoRow = {
        id,
        title: resolvedTitle,
        description,
        youtube_url: null,
        file_path: filePath,
        original_name: file.name,
        mime_type: file.type || null,
        size: file.size,
        created_at: batchCreatedAt,
      };

      const { error } = await supabase.from("videos").insert({
        id: row.id,
        title: row.title,
        description: row.description,
        youtube_url: row.youtube_url,
        file_path: row.file_path,
        original_name: row.original_name,
        mime_type: row.mime_type,
        size: row.size,
        created_at: row.created_at,
      });

      if (error) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.videos, filePath);
        } catch {
          // ignore cleanup failure
        }
        throw new Error(error.message);
      }

      created.push(toVideoItem(row));
    }

    return NextResponse.json({ items: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
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
      .from("videos")
      .select("id, file_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; file_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await getSupabaseAdmin().from("videos").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);

    if (row.file_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.videos, row.file_path);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed." },
      { status: 500 },
    );
  }
}
