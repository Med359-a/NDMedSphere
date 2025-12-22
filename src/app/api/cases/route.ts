import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import path from "node:path";
import { promises as fs } from "node:fs";
import type { CaseItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cases.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readAll(): Promise<CaseItem[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CaseItem[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: CaseItem[]) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function parseTags(input: unknown) {
  const values = Array.isArray(input)
    ? input.map((v) => String(v))
    : typeof input === "string"
      ? input.split(",")
      : [];

  const cleaned = values
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.slice(0, 40));

  return Array.from(new Set(cleaned)).slice(0, 12);
}

export async function GET() {
  const items = await readAll();
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(items, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: unknown;
        summary?: unknown;
        tags?: unknown;
      }
    | null;

  const title = String(body?.title ?? "").trim();
  const summary = String(body?.summary ?? "").trim();
  const tags = parseTags(body?.tags);

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!summary) {
    return NextResponse.json({ error: "Summary is required." }, { status: 400 });
  }

  const item: CaseItem = {
    id: crypto.randomUUID(),
    title,
    summary,
    tags,
    createdAt: new Date().toISOString(),
  };

  const current = await readAll();
  await writeAll([item, ...current]);
  return NextResponse.json({ item }, { status: 201 });
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
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  items.splice(idx, 1);
  await writeAll(items);
  return NextResponse.json({ ok: true });
}

