import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import type { StudyItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StudyDoc = {
  _id: string;
  title: string;
  notes: string;
  tags: string[];
  url?: string;
  imageFileId?: ObjectId;
  createdAt: Date;
};

function toItem(doc: StudyDoc): StudyItem {
  return {
    id: doc._id,
    title: doc.title,
    notes: doc.notes,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    url: doc.url,
    imageFileId: doc.imageFileId?.toString(),
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
      .collection<StudyDoc>("personalStudying")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load notes." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "news_images" });

    let body: {
      title: string;
      notes: string;
      tags: string[];
      url: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        tags: parseTags(formData.get("tags")),
        url: String(formData.get("url") ?? "").trim(),
        file: (formData.get("file") as File) || null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as any;
      body = {
        title: String(json?.title ?? "").trim(),
        notes: String(json?.notes ?? "").trim(),
        tags: parseTags(json?.tags),
        url: String(json?.url ?? "").trim(),
        file: null,
      };
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!body.notes) {
      return NextResponse.json({ error: "Notes are required." }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    if (body.url && !url) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    let imageFileId: ObjectId | undefined;

    if (body.file) {
      if (!body.file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
      }

      if (body.file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 10MB)." }, { status: 413 });
      }

      const fileId = new ObjectId();
      const upload = bucket.openUploadStreamWithId(fileId, body.file.name, {
        contentType: body.file.type,
      });

      const buffer = Buffer.from(await body.file.arrayBuffer());
      await new Promise<void>((resolve, reject) => {
        Readable.from(buffer)
          .pipe(upload)
          .on("error", reject)
          .on("finish", () => resolve());
      });

      imageFileId = fileId;
    }

    const doc: StudyDoc = {
      _id: crypto.randomUUID(),
      title: body.title,
      notes: body.notes,
      tags: body.tags,
      url: url || undefined,
      imageFileId,
      createdAt: new Date(),
    };

    await db.collection<StudyDoc>("personalStudying").insertOne(doc);
    return NextResponse.json({ item: toItem(doc) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create note." },
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
    const collection = db.collection<StudyDoc>("personalStudying");
    const doc = await collection.findOne({ _id: id });

    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await collection.deleteOne({ _id: id });

    if (doc.imageFileId) {
      const bucket = new GridFSBucket(db, { bucketName: "news_images" });
      try {
        await bucket.delete(doc.imageFileId);
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete note." },
      { status: 500 },
    );
  }
}

