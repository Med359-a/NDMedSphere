import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { BookItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookDoc = {
  _id: string;
  title: string;
  author?: string;
  url?: string;
  notes?: string;
  createdAt: Date;
};

function toItem(doc: BookDoc): BookItem {
  return {
    id: doc._id,
    title: doc.title,
    author: doc.author,
    url: doc.url,
    notes: doc.notes,
    createdAt: doc.createdAt.toISOString(),
  };
}

function normalizeUrl(value: string) {
  const v = value.trim();
  if (!v) return "";
  try {
    return new URL(v).toString();
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection<BookDoc>("books")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
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

  const body = (await request.json().catch(() => null)) as
    | { title?: unknown; author?: unknown; url?: unknown; notes?: unknown }
    | null;

  const title = String(body?.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const author = String(body?.author ?? "").trim();
  const notes = String(body?.notes ?? "").trim();
  const urlRaw = String(body?.url ?? "");
  const url = normalizeUrl(urlRaw);
  if (urlRaw.trim() && !url) {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const doc: BookDoc = {
      _id: crypto.randomUUID(),
      title,
      author: author || undefined,
      url: url || undefined,
      notes: notes || undefined,
      createdAt: new Date(),
    };

    await db.collection<BookDoc>("books").insertOne(doc);
    return NextResponse.json({ item: toItem(doc) }, { status: 201 });
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
    const db = await getDb();
    const res = await db.collection<BookDoc>("books").deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete book." },
      { status: 500 },
    );
  }
}

