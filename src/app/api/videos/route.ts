import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { GridFSBucket, ObjectId } from "mongodb";
import type { VideoItem } from "@/lib/video-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VideoDoc = {
  _id: string;
  title: string;
  description: string;
  youtubeUrl?: string; // New field
  fileId?: ObjectId;   // Now optional
  originalName?: string; // Now optional
  mimeType?: string;   // Now optional
  size?: number;       // Now optional
  createdAt: Date;
};

function toItem(doc: VideoDoc): VideoItem {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    youtubeUrl: doc.youtubeUrl,
    originalName: doc.originalName,
    mimeType: doc.mimeType,
    size: doc.size,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection<VideoDoc>("videos")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load videos." },
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
    const bucket = new GridFSBucket(db, { bucketName: "videos" });

    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();

    const candidates = formData.getAll("files");
    const single = formData.get("file");
    const entries = candidates.length ? candidates : single ? [single] : [];

    const files = entries.filter((v): v is File => typeof v === "object");

    // If no files AND no youtubeUrl, return error
    if (files.length === 0 && !youtubeUrl) {
      return NextResponse.json(
        { error: "No files or YouTube URL found." },
        { status: 400 },
      );
    }

    const collection = db.collection<VideoDoc>("videos");
    const now = new Date();
    const created: VideoItem[] = [];

    // Handle YouTube URL if present
    if (youtubeUrl) {
      const id = crypto.randomUUID();
      const doc: VideoDoc = {
        _id: id,
        title: title || "YouTube Video",
        description,
        youtubeUrl,
        createdAt: now,
      };
      await collection.insertOne(doc);
      created.push(toItem(doc));
    }

    // Soft limit: 250MB per file (still parsed in-memory by formData()).
    const MAX_BYTES = 250 * 1024 * 1024;

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
      const resolvedTitle =
        files.length > 1 ? (title ? `${title} (${i + 1})` : file.name) : title || file.name;

      const upload = bucket.openUploadStream(id, {
        contentType: file.type || "application/octet-stream",
        metadata: { originalName: file.name },
      });

      const buffer = Buffer.from(await file.arrayBuffer());
      await new Promise<void>((resolve, reject) => {
        Readable.from(buffer)
          .pipe(upload)
          .on("error", reject)
          .on("finish", () => resolve());
      });

      const fileId = upload.id;
      if (!(fileId instanceof ObjectId)) {
        // Shouldn't happen with the official driver, but keeps types safe.
        throw new Error("Unexpected GridFS file id type.");
      }

      const doc: VideoDoc = {
        _id: id,
        title: resolvedTitle,
        description,
        fileId,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        createdAt: now,
      };

      try {
        await collection.insertOne(doc);
      } catch (e) {
        try {
          await bucket.delete(fileId);
        } catch {
          // ignore
        }
        throw e;
      }

      created.push(toItem(doc));
    }

    return NextResponse.json({ items: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
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
    const collection = db.collection<VideoDoc>("videos");
    const doc = await collection.findOne({ _id: id });
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await collection.deleteOne({ _id: id });

    const bucket = new GridFSBucket(db, { bucketName: "videos" });
    try {
      if (doc.fileId) {
        await bucket.delete(doc.fileId);
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed." },
      { status: 500 },
    );
  }
}


