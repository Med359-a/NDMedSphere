import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath, normalizeUrl } from "@/lib/content-utils";
import { type BookRow, toBookItem } from "@/lib/supabase-content";
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
      .from("books")
      .select("id, title, author, url, notes, file_path, file_name, mime_type, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as BookRow[]).map(toBookItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load books." },
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
      author: string;
      url: string;
      notes: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        author: String(formData.get("author") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        file: (formData.get("file") as File | null) ?? null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as
        | {
            title?: unknown;
            author?: unknown;
            url?: unknown;
            notes?: unknown;
          }
        | null;

      body = {
        title: String(json?.title ?? "").trim(),
        author: String(json?.author ?? "").trim(),
        url: String(json?.url ?? "").trim(),
        notes: String(json?.notes ?? "").trim(),
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
    let fileName: string | null = null;
    let mimeType: string | null = null;

    if (body.file && body.file.size > 0) {
      if (body.file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 415 });
      }

      if (body.file.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 50MB)." }, { status: 413 });
      }

      fileName = body.file.name;
      mimeType = body.file.type || "application/pdf";
      filePath = buildStoragePath([id], body.file.name || `${id}.pdf`);
      await uploadStorageObject(STORAGE_BUCKETS.books, filePath, body.file);
    }

    const row: BookRow = {
      id,
      title: body.title,
      author: body.author || null,
      url: url || null,
      notes: body.notes || null,
      file_path: filePath,
      file_name: fileName,
      mime_type: mimeType,
      created_at: createdAt,
    };

    const { error } = await getSupabaseAdmin().from("books").insert(row);
    if (error) {
      if (filePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.books, filePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ item: toBookItem(row) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create book." },
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
      .from("books")
      .select("id, file_path")
      .eq("id", id)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; file_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await getSupabaseAdmin().from("books").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);

    if (row.file_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.books, row.file_path);
      } catch {
        // ignore storage cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete book." },
      { status: 500 },
    );
  }
}
