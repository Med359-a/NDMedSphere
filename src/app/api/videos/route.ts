import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { VideoItem } from "@/lib/video-types";
import { isAdminRequest } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "videos");
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "videos.json");

async function ensureStore() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readAll(): Promise<VideoItem[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as VideoItem[];
    return [];
  } catch {
    return [];
  }
}

async function writeAll(items: VideoItem[]) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function toSafeExt(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  if (!ext || ext.length > 8) return ".mp4";
  return ext;
}

export async function GET() {
  const items = await readAll();
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(items, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const candidates = formData.getAll("files");
  const single = formData.get("file");
  const entries = candidates.length ? candidates : single ? [single] : [];

  const files = entries.filter((v): v is File => typeof v === "object");
  if (files.length === 0) {
    return NextResponse.json(
      { error: "No files found. Use field name 'file' or 'files'." },
      { status: 400 },
    );
  }

  // Soft limit: 250MB per file (still parsed in-memory by formData()).
  const MAX_BYTES = 250 * 1024 * 1024;

  const now = new Date().toISOString();
  const current = await readAll();
  const created: VideoItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max is ${MAX_BYTES} bytes.` },
        { status: 413 },
      );
    }

    const id = crypto.randomUUID();
    const ext = toSafeExt(file.name);
    const filename = `${id}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    created.push({
      id,
      title: files.length > 1 ? (title ? `${title} (${i + 1})` : file.name) : title || file.name,
      description,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      createdAt: now,
    });
  }

  await writeAll([...created, ...current]);
  return NextResponse.json({ items: created }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing query param 'id'." }, { status: 400 });
  }

  const items = await readAll();
  const idx = items.findIndex((v) => v.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const [removed] = items.splice(idx, 1);
  await writeAll(items);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, removed.filename));
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true });
}


