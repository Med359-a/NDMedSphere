import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAdminRequest } from "@/lib/admin";
import { buildStoragePath } from "@/lib/content-utils";
import {
  getSupabaseAdmin,
  removeStorageObject,
  STORAGE_BUCKETS,
  uploadStorageObject,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingAnswer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const topicId = String(formData.get("topicId") ?? "").trim();
    const question = String(formData.get("question") ?? "").trim();
    const answersRaw = String(formData.get("answers") ?? "[]");
    const explanation = String(formData.get("explanation") ?? "").trim();
    const file = (formData.get("file") as File | null) ?? null;

    if (!topicId || !question) {
      return NextResponse.json(
        { error: "Topic ID and Question are required." },
        { status: 400 },
      );
    }

    let parsedAnswers: IncomingAnswer[] = [];
    try {
      const raw = JSON.parse(answersRaw) as Array<{
        id?: unknown;
        text?: unknown;
        isCorrect?: unknown;
      }>;

      parsedAnswers = (Array.isArray(raw) ? raw : [])
        .map((answer) => ({
          id: String(answer.id ?? crypto.randomUUID()),
          text: String(answer.text ?? "").trim(),
          isCorrect: Boolean(answer.isCorrect),
        }))
        .filter((answer) => answer.text);
    } catch {
      return NextResponse.json({ error: "Invalid answers format." }, { status: 400 });
    }

    if (parsedAnswers.length < 2) {
      return NextResponse.json({ error: "At least 2 answers are required." }, { status: 400 });
    }

    if (!parsedAnswers.some((answer) => answer.isCorrect)) {
      return NextResponse.json(
        { error: "At least one answer must be marked correct." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: topicRows, error: topicError } = await supabase
      .from("case_topics")
      .select("id")
      .eq("id", topicId)
      .limit(1);

    if (topicError) throw new Error(topicError.message);
    if (!topicRows?.length) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    const { data: sortRows, error: sortError } = await supabase
      .from("case_quizzes")
      .select("sort_order")
      .eq("topic_id", topicId)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (sortError) throw new Error(sortError.message);

    const quizId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const sortOrder = ((sortRows?.[0] as { sort_order: number } | undefined)?.sort_order ?? -1) + 1;

    let imagePath: string | null = null;
    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 10MB)." }, { status: 413 });
      }

      imagePath = buildStoragePath([topicId, quizId], file.name || `${quizId}.image`);
      await uploadStorageObject(STORAGE_BUCKETS.caseQuizImages, imagePath, file);
    }

    const { error: insertQuizError } = await supabase.from("case_quizzes").insert({
      id: quizId,
      topic_id: topicId,
      question,
      image_path: imagePath,
      explanation: explanation || null,
      sort_order: sortOrder,
      created_at: createdAt,
    });

    if (insertQuizError) {
      if (imagePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.caseQuizImages, imagePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(insertQuizError.message);
    }

    const answerRows = parsedAnswers.map((answer, index) => ({
      id: answer.id,
      quiz_id: quizId,
      text: answer.text,
      is_correct: answer.isCorrect,
      sort_order: index,
      created_at: createdAt,
    }));

    const { error: answersError } = await supabase.from("case_quiz_answers").insert(answerRows);
    if (answersError) {
      await supabase.from("case_quizzes").delete().eq("id", quizId);
      if (imagePath) {
        try {
          await removeStorageObject(STORAGE_BUCKETS.caseQuizImages, imagePath);
        } catch {
          // ignore cleanup failure
        }
      }
      throw new Error(answersError.message);
    }

    return NextResponse.json(
      {
        quiz: {
          id: quizId,
          question,
          imageFileId: imagePath ?? undefined,
          answers: parsedAnswers,
          explanation: explanation || undefined,
          createdAt,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to add quiz." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const topicId = searchParams.get("topicId");
  const quizId = searchParams.get("quizId");

  if (!topicId || !quizId) {
    return NextResponse.json({ error: "Missing topicId or quizId." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("case_quizzes")
      .select("id, image_path")
      .eq("topic_id", topicId)
      .eq("id", quizId)
      .limit(1);

    if (error) throw new Error(error.message);

    const row = data?.[0] as { id: string; image_path: string | null } | undefined;
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("case_quizzes")
      .delete()
      .eq("topic_id", topicId)
      .eq("id", quizId);

    if (deleteError) throw new Error(deleteError.message);

    if (row.image_path) {
      try {
        await removeStorageObject(STORAGE_BUCKETS.caseQuizImages, row.image_path);
      } catch {
        // ignore cleanup failure
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete quiz." },
      { status: 500 },
    );
  }
}
