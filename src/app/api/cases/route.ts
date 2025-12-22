import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { TopicItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// MongoDB Document Schema
export type TopicDoc = {
  _id: string;
  title: string;
  description?: string;
  quizzes: Array<{
    id: string;
    question: string;
    imageFileId?: string; // stored as string ID from GridFS
    answers: Array<{ id: string; text: string; isCorrect: boolean }>;
    explanation?: string;
    createdAt: Date;
  }>;
  createdAt: Date;
};

function toItem(doc: TopicDoc): TopicItem {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    quizzes: (doc.quizzes || []).map((q) => ({
      id: q.id,
      question: q.question,
      imageFileId: q.imageFileId,
      answers: q.answers,
      explanation: q.explanation,
      createdAt: q.createdAt.toISOString(),
    })),
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection<TopicDoc>("topics") // Renamed collection to 'topics' to avoid conflict/confusion, or migrate 'cases'
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load topics." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { title?: unknown; description?: unknown }
    | null;

  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const doc: TopicDoc = {
      _id: crypto.randomUUID(),
      title,
      description,
      quizzes: [],
      createdAt: new Date(),
    };
    await db.collection<TopicDoc>("topics").insertOne(doc);
    return NextResponse.json({ item: toItem(doc) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create topic." },
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
    const res = await db.collection<TopicDoc>("topics").deleteOne({ _id: id });
    
    // Ideally we should also delete all images associated with quizzes in this topic
    // But for now, we'll rely on a manual cleanup or future improvement
    
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete topic." },
      { status: 500 },
    );
  }
}
