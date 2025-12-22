import { NextRequest } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookDoc = {
  _id: string;
  fileId?: ObjectId;
};

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
    const books = db.collection<BookDoc>("books");
    const doc = await books.findOne({ _id: id }, { projection: { fileId: 1 } });

    if (!doc || !doc.fileId) {
      return new Response(JSON.stringify({ error: "File not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bucket = new GridFSBucket(db, { bucketName: "books" });
    const file = await bucket.find({ _id: doc.fileId }).next();

    if (!file) {
      return new Response(JSON.stringify({ error: "File not found in storage." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = bucket.openDownloadStream(doc.fileId);
    
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": `inline; filename="${file.metadata?.originalName || 'document.pdf'}"`,
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Download failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
