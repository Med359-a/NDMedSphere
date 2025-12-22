import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { CaseItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CaseDoc = {
  _id: string;
  title: string;
  summary: string;
  tags: string[];
  createdAt: Date;
};

function toItem(doc: CaseDoc): CaseItem {
  return {
    id: doc._id,
    title: doc.title,
    summary: doc.summary,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    createdAt: doc.createdAt.toISOString(),
  };
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
  try {
    const db = await getDb();
    const docs = await db
      .collection<CaseDoc>("cases")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load cases." },
      { status: 500 },
    );
  }
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

  try {
    const db = await getDb();
    const doc: CaseDoc = {
      _id: crypto.randomUUID(),
      title,
      summary,
      tags,
      createdAt: new Date(),
    };
    await db.collection<CaseDoc>("cases").insertOne(doc);
    return NextResponse.json({ item: toItem(doc) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create case." },
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
    const res = await db.collection<CaseDoc>("cases").deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete case." },
      { status: 500 },
    );
  }
}

