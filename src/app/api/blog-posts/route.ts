import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath } from "@/lib/content-utils";
import { getBlogPageBySlug } from "@/lib/site-sections";
import { type MedicalNewsRow, toBlogPostItem } from "@/lib/supabase-content";
import {
  getSupabaseAdmin,
  removeStorageObject,
  STORAGE_BUCKETS,
  uploadStorageObject,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const pageSlug = String(request.nextUrl.searchParams.get("page") ?? "").trim();
  if (!pageSlug) {
    return NextResponse.json({ error: "Missing query param 'page'." }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("medical_news")
      .select("id, title, notes, tags, url, image_path, page_slug, page_group, created_at")
      .eq("page_slug", pageSlug)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json(((data ?? []) as MedicalNewsRow[]).map(toBlogPostItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load posts." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const pageSlug = String(formData.get("pageSlug") ?? "").trim();
    const pageGroup = String(formData.get("pageGroup") ?? "").trim() as "products" | "services";
    const file = (formData.get("file") as File | null) ?? null;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!body) {
      return NextResponse.json({ error: "Body is required." }, { status: 400 });
    }

    const page = getBlogPageBySlug(pageGroup, pageSlug);
    if (!page && !(pageGroup === "products" && pageSlug === "medical-news")) {
      return NextResponse.json({ error: "Invalid page target." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    let imagePath: string | null = null;

    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 10MB)." }, { status: 413 });
      }

      imagePath = buildStoragePath([pageGroup, pageSlug, id], file.name || `${id}.image`);
      await uploadStorageObject(STORAGE_BUCKETS.medicalNewsImages, imagePath, file);
    }

    const row: MedicalNewsRow = {
      id,
      title,
      notes: body,
      tags: [],
      url: null,
      image_path: imagePath,
      page_slug: pageSlug,
      page_group: pageGroup,
      created_at: createdAt,
    };

    const { error } = await getSupabaseAdmin().from("medical_news").insert({
      id: row.id,
      title: row.title,
      notes: row.notes,
      tags: row.tags,
      url: row.url,
      image_path: row.image_path,
      page_slug: row.page_slug,
      page_group: row.page_group,
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

    return NextResponse.json({ item: toBlogPostItem(row) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create post." },
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
      { error: e instanceof Error ? e.message : "Failed to delete post." },
      { status: 500 },
    );
  }
}
