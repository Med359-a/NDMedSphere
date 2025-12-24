import { NextRequest } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const bucket = new GridFSBucket(db, { bucketName: "usmle_files" });
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid ID format." }), { status: 400 });
    }

    const file = await bucket.find({ _id: objectId }).next();
    if (!file) {
      return new Response(JSON.stringify({ error: "File not found." }), { status: 404 });
    }

    const stream = bucket.openDownloadStream(objectId);
    
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Image load failed." }),
      { status: 500 }
    );
  }
}
