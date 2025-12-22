import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";
import type { TopicDoc } from "@/app/api/cases/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const topicId = String(formData.get("topicId") ?? "");
    const question = String(formData.get("question") ?? "").trim();
    const answersRaw = String(formData.get("answers") ?? "[]");
    const explanation = String(formData.get("explanation") ?? "").trim();
    const file = formData.get("file") as File | null;

    if (!topicId || !question) {
      return NextResponse.json({ error: "Topic ID and Question are required." }, { status: 400 });
    }

    let answers: Array<{ id: string; text: string; isCorrect: boolean }> = [];
    try {
      answers = JSON.parse(answersRaw);
      if (!Array.isArray(answers) || answers.length < 2) {
        throw new Error("At least 2 answers required");
      }
    } catch {
      return NextResponse.json({ error: "Invalid answers format." }, { status: 400 });
    }

    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "quiz_images" });
    
    let imageFileId: string | undefined;

    if (file && file.size > 0) {
      // 10MB limit for images
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 10MB)." }, { status: 413 });
      }
      
      const fileId = new ObjectId();
      const upload = bucket.openUploadStreamWithId(fileId, file.name, {
        contentType: file.type,
      });

      const buffer = Buffer.from(await file.arrayBuffer());
      await new Promise<void>((resolve, reject) => {
        Readable.from(buffer)
          .pipe(upload)
          .on("error", reject)
          .on("finish", () => resolve());
      });

      imageFileId = fileId.toString();
    }

    const quizId = crypto.randomUUID();
    const newQuiz = {
      id: quizId,
      question,
      imageFileId,
      answers,
      explanation: explanation || undefined,
      createdAt: new Date(),
    };

    const res = await db.collection<TopicDoc>("topics").updateOne(
      { _id: topicId },
      { $push: { quizzes: newQuiz } }
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    return NextResponse.json({ quiz: {
      ...newQuiz,
      createdAt: newQuiz.createdAt.toISOString()
    }}, { status: 201 });

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
    const db = await getDb();
    
    // Find the quiz first to see if it has an image to delete
    const topic = await db.collection<TopicDoc>("topics").findOne(
      { _id: topicId, "quizzes.id": quizId },
      { projection: { "quizzes.$": 1 } }
    );

    if (topic && topic.quizzes?.[0]?.imageFileId) {
      const bucket = new GridFSBucket(db, { bucketName: "quiz_images" });
      try {
        await bucket.delete(new ObjectId(topic.quizzes[0].imageFileId));
      } catch {
        // ignore
      }
    }

    const res = await db.collection<TopicDoc>("topics").updateOne(
      { _id: topicId },
      { $pull: { quizzes: { id: quizId } } as any } // cast to any to avoid strict type issues with pull
    );

    if (res.modifiedCount === 0) {
      return NextResponse.json({ error: "Not found or not modified." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete quiz." },
      { status: 500 },
    );
  }
}
