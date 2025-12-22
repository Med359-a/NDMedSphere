import { NextRequest } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VideoDoc = {
  _id: string;
  fileId: ObjectId;
  mimeType: string;
};

function parseRange(rangeHeader: string, size: number) {
  const match = rangeHeader.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) return null;

  const startRaw = match[1];
  const endRaw = match[2];
  if (!startRaw && !endRaw) return null;

  // bytes=-500 (suffix)
  if (!startRaw && endRaw) {
    const suffix = Number.parseInt(endRaw, 10);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    const start = Math.max(size - suffix, 0);
    const end = size - 1;
    return { start, end };
  }

  const start = Number.parseInt(startRaw || "0", 10);
  const end = endRaw ? Number.parseInt(endRaw, 10) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < start || start >= size) return null;

  return { start, end: Math.min(end, size - 1) };
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing query param 'id'." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await getDb();
    const videos = db.collection<VideoDoc>("videos");
    const doc = await videos.findOne({ _id: id }, { projection: { fileId: 1, mimeType: 1 } });
    if (!doc) {
      return new Response(JSON.stringify({ error: "Not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bucket = new GridFSBucket(db, { bucketName: "videos" });
    const file = await bucket.find({ _id: doc.fileId }).next();
    if (!file) {
      return new Response(JSON.stringify({ error: "File not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const total = file.length;
    const contentType =
      (typeof file.contentType === "string" && file.contentType) ||
      doc.mimeType ||
      "application/octet-stream";

    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      const parsed = parseRange(rangeHeader, total);
      if (!parsed) {
        return new Response(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${total}`,
            "Cache-Control": "no-store",
          },
        });
      }

      const { start, end } = parsed;
      const chunkSize = end - start + 1;

      const stream = bucket.openDownloadStream(doc.fileId, {
        start,
        end: end + 1, // GridFS end is exclusive
      });

      return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(chunkSize),
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Cache-Control": "no-store",
        },
      });
    }

    const stream = bucket.openDownloadStream(doc.fileId);
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(total),
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Stream failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

