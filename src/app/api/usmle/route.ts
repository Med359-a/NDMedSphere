import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import type { UsmleItem } from "@/lib/content-types";
import { isAdminRequest } from "@/lib/admin";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UsmleDoc = {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  fileId?: ObjectId;
  fileName?: string;
  fileType?: string;
  createdAt: Date;
};

function toItem(doc: UsmleDoc): UsmleItem {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    url: doc.url,
    fileId: doc.fileId?.toString(),
    fileName: doc.fileName,
    fileType: doc.fileType,
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
      .collection<UsmleDoc>("usmle")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(docs.map(toItem), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load resources." },
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
    const bucket = new GridFSBucket(db, { bucketName: "usmle_files" });

    let body: {
      title: string;
      description: string;
      url: string;
      file: File | null;
    };

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        file: (formData.get("file") as File) || null,
      };
    } else {
      const json = (await request.json().catch(() => null)) as any;
      body = {
        title: String(json?.title ?? "").trim(),
        description: String(json?.description ?? "").trim(),
        url: String(json?.url ?? "").trim(),
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
    let fileType: string | undefined;

    if (body.file) {
      // 100MB limit
      if (body.file.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 100MB)." }, { status: 413 });
      }

      if (body.file.type === "application/pdf") {
        fileType = "pdf";
      } else if (body.file.type.startsWith("image/")) {
        fileType = "image";
      } else {
        return NextResponse.json({ error: "Only PDF or Image files are allowed." }, { status: 415 });
      }

      const fId = new ObjectId();
      const upload = bucket.openUploadStreamWithId(fId, body.file.name, {
        contentType: body.file.type,
      });

      const buffer = Buffer.from(await body.file.arrayBuffer());
      await new Promise<void>((resolve, reject) => {
        Readable.from(buffer)
          .pipe(upload)
          .on("error", reject)
          .on("finish", () => resolve());
      });

      fileId = fId;
    }

    const doc: UsmleDoc = {
      _id: id,
      title: body.title,
      description: body.description || undefined,
      url: url || undefined,
      fileId,
      fileName: body.file?.name,
      fileType,
      createdAt: new Date(),
    };

    await db.collection<UsmleDoc>("usmle").insertOne(doc);
    return NextResponse.json({ item: toItem(doc) }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create resource." },
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
    const collection = db.collection<UsmleDoc>("usmle");
    const doc = await collection.findOne({ _id: id });

    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await collection.deleteOne({ _id: id });

    if (doc.fileId) {
      const bucket = new GridFSBucket(db, { bucketName: "usmle_files" });
      try {
        await bucket.delete(doc.fileId);
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete resource." },
      { status: 500 },
    );
  }
}
