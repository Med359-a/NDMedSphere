import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
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
  fileId?: ObjectId;
  createdAt: Date;
};

function toItem(doc: BookDoc): BookItem {
  return {
    id: doc._id,
    title: doc.title,
    author: doc.author,
    url: doc.url,
    notes: doc.notes,
    fileId: doc.fileId?.toString(),
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

  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: "books" });

    // Handle multipart form data
    let body: {
      title: string;
      author: string;
      url: string;
      notes: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        author: String(formData.get("author") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        file: (formData.get("file") as File) || null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as any;
      body = {
        title: String(json?.title ?? "").trim(),
        author: String(json?.author ?? "").trim(),
        url: String(json?.url ?? "").trim(),
        notes: String(json?.notes ?? "").trim(),
        file: null,
      };
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    if (body.url && !url) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let fileId: ObjectId | undefined;

    if (body.file) {
      if (body.file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 415 });
      }

      // 50MB limit for PDFs
      if (body.file.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 50MB)." }, { status: 413 });
      }

      const upload = bucket.openUploadStream(id, {
        contentType: body.file.type,
        metadata: { originalName: body.file.name },
      });

      const buffer = Buffer.from(await body.file.arrayBuffer());
      await new Promise<void>((resolve, reject) => {
        Readable.from(buffer)
          .pipe(upload)
          .on("error", reject)
          .on("finish", () => resolve());
      });

      fileId = upload.id as ObjectId;
    }

    const doc: BookDoc = {
      _id: id,
      title: body.title,
      author: body.author || undefined,
      url: url || undefined,
      notes: body.notes || undefined,
      fileId,
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
    const collection = db.collection<BookDoc>("books");
    const doc = await collection.findOne({ _id: id });

    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await collection.deleteOne({ _id: id });

    if (doc.fileId) {
      const bucket = new GridFSBucket(db, { bucketName: "books" });
      try {
        await bucket.delete(doc.fileId);
      } catch {
        // ignore if file missing
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete book." },
      { status: 500 },
    );
  }
}

