import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { TopicItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { listCaseTopics } from "@/lib/supabase-content";
import { getSupabaseAdmin, removeStorageObject, STORAGE_BUCKETS } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const topics = await listCaseTopics();
    return NextResponse.json(topics, {
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
    const item: TopicItem = {
      id: crypto.randomUUID(),
      title,
      description: description || undefined,
      quizzes: [],
      createdAt: new Date().toISOString(),
    };

    const { error } = await getSupabaseAdmin().from("case_topics").insert({
      id: item.id,
      title: item.title,
      description: item.description ?? null,
      created_at: item.createdAt,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ item }, { status: 201 });
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
    const supabase = getSupabaseAdmin();

    const { data: topicRows, error: topicError } = await supabase
      .from("case_topics")
      .select("id")
      .eq("id", id)
      .limit(1);

    if (topicError) throw new Error(topicError.message);
    if (!topicRows?.length) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { data: quizRows, error: quizError } = await supabase
      .from("case_quizzes")
      .select("image_path")
      .eq("topic_id", id);

    if (quizError) throw new Error(quizError.message);

    const { error: deleteError } = await supabase.from("case_topics").delete().eq("id", id);
    if (deleteError) throw new Error(deleteError.message);

    for (const quiz of quizRows ?? []) {
      const imagePath = (quiz as { image_path: string | null }).image_path;
      if (!imagePath) continue;

      try {
        await removeStorageObject(STORAGE_BUCKETS.caseQuizImages, imagePath);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete topic." },
      { status: 500 },
    );
  }
}
