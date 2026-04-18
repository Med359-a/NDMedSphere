import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { GridFSBucket, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { loadEnvFiles } from "./lib/load-env.mjs";

loadEnvFiles();

const mongoUri = (process.env.MONGODB_URI ?? "").trim();
const mongoDbName = (process.env.MONGODB_DB ?? "ndmedsphere").trim() || "ndmedsphere";
const supabaseUrl = (process.env.SUPABASE_URL ?? "").trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

if (!mongoUri || !supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Migration failed.");
  console.error(
    "Reason: Missing MONGODB_URI, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const mongo = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function toIsoDateString(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }

  return new Date().toISOString();
}

function sanitizeSegment(value) {
  return String(value || "file")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";
}

function buildStoragePath(parts, fileName) {
  const safeParts = parts.map((part) => sanitizeSegment(part)).filter(Boolean);
  return [...safeParts, sanitizeSegment(fileName)].join("/");
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

async function uploadGridFsFile({
  db,
  bucketName,
  fileId,
  targetBucket,
  path,
}) {
  const bucket = new GridFSBucket(db, { bucketName });
  const objectId = fileId instanceof ObjectId ? fileId : new ObjectId(String(fileId));
  const file = await bucket.find({ _id: objectId }).next();
  if (!file) return null;

  const buffer = await streamToBuffer(bucket.openDownloadStream(objectId));
  const { error } = await supabase.storage.from(targetBucket).upload(path, buffer, {
    upsert: true,
    contentType: typeof file.contentType === "string" ? file.contentType : undefined,
    cacheControl: "3600",
  });
  if (error) throw error;

  return {
    path,
    name:
      typeof file.metadata?.originalName === "string" && file.metadata.originalName
        ? file.metadata.originalName
        : file.filename,
    mimeType: typeof file.contentType === "string" ? file.contentType : null,
    size: file.length,
  };
}

async function upsert(table, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

async function detectCasesCollection(db) {
  const topicsDoc = await db.collection("topics").find({}).limit(1).next();
  if (topicsDoc) return "topics";
  const casesDoc = await db.collection("cases").find({}).limit(1).next();
  if (casesDoc) return "cases";
  return "topics";
}

try {
  await mongo.connect();
  const db = mongo.db(mongoDbName);

  const books = await db.collection("books").find({}).toArray();
  const bookRows = [];
  for (const book of books) {
    let filePath = null;
    let fileName = null;
    let mimeType = null;

    if (book.fileId) {
      const uploaded = await uploadGridFsFile({
        db,
        bucketName: "books",
        fileId: book.fileId,
        targetBucket: "books",
        path: buildStoragePath([book._id], book.title || "book.pdf"),
      });
      filePath = uploaded?.path ?? null;
      fileName = uploaded?.name ?? null;
      mimeType = uploaded?.mimeType ?? null;
    }

    bookRows.push({
      id: book._id,
      title: book.title,
      author: book.author ?? null,
      url: book.url ?? null,
      notes: book.notes ?? null,
      file_path: filePath,
      file_name: fileName,
      mime_type: mimeType,
      created_at: toIsoDateString(book.createdAt),
    });
  }
  await upsert("books", bookRows);

  const casesCollection = await detectCasesCollection(db);
  const topics = await db.collection(casesCollection).find({}).toArray();
  const topicRows = [];
  const quizRows = [];
  const answerRows = [];

  for (const topic of topics) {
    topicRows.push({
      id: topic._id,
      title: topic.title,
      description: topic.description ?? null,
      created_at: toIsoDateString(topic.createdAt),
    });

    for (const [quizIndex, quiz] of (Array.isArray(topic.quizzes) ? topic.quizzes : []).entries()) {
      let imagePath = null;
      if (quiz.imageFileId) {
        const uploaded = await uploadGridFsFile({
          db,
          bucketName: "quiz_images",
          fileId: quiz.imageFileId,
          targetBucket: "case-quiz-images",
          path: buildStoragePath([topic._id, quiz.id], `${quiz.id}.image`),
        });
        imagePath = uploaded?.path ?? null;
      }

      quizRows.push({
        id: quiz.id,
        topic_id: topic._id,
        question: quiz.question,
        image_path: imagePath,
        explanation: quiz.explanation ?? null,
        sort_order: quizIndex,
        created_at: toIsoDateString(quiz.createdAt),
      });

      for (const [answerIndex, answer] of (Array.isArray(quiz.answers) ? quiz.answers : []).entries()) {
        answerRows.push({
          id: answer.id,
          quiz_id: quiz.id,
          text: answer.text,
          is_correct: Boolean(answer.isCorrect),
          sort_order: answerIndex,
          created_at: toIsoDateString(quiz.createdAt),
        });
      }
    }
  }

  await upsert("case_topics", topicRows);
  await upsert("case_quizzes", quizRows);
  await upsert("case_quiz_answers", answerRows);

  const studyDocs = await db.collection("personalStudying").find({}).toArray();
  const studyRows = [];
  for (const doc of studyDocs) {
    let imagePath = null;
    if (doc.imageFileId) {
      const uploaded = await uploadGridFsFile({
        db,
        bucketName: "news_images",
        fileId: doc.imageFileId,
        targetBucket: "medical-news-images",
        path: buildStoragePath([doc._id], `${doc._id}.image`),
      });
      imagePath = uploaded?.path ?? null;
    }

    studyRows.push({
      id: doc._id,
      title: doc.title,
      notes: doc.notes,
      tags: Array.isArray(doc.tags) ? doc.tags.map((tag) => String(tag)) : [],
      url: doc.url ?? null,
      image_path: imagePath,
      created_at: toIsoDateString(doc.createdAt),
    });
  }
  await upsert("medical_news", studyRows);

  const usmleDocs = await db.collection("usmle").find({}).toArray();
  const usmleRows = [];
  for (const doc of usmleDocs) {
    let filePath = null;
    let fileName = doc.fileName ?? null;
    let mimeType = null;

    if (doc.fileId) {
      const uploaded = await uploadGridFsFile({
        db,
        bucketName: "usmle_files",
        fileId: doc.fileId,
        targetBucket: "usmle-files",
        path: buildStoragePath([doc._id], doc.fileName || `${doc._id}.file`),
      });
      filePath = uploaded?.path ?? null;
      fileName = uploaded?.name ?? fileName;
      mimeType = uploaded?.mimeType ?? null;
    }

    usmleRows.push({
      id: doc._id,
      title: doc.title,
      description: doc.description ?? null,
      url: doc.url ?? null,
      file_path: filePath,
      file_name: fileName,
      file_type: doc.fileType ?? null,
      mime_type: mimeType,
      created_at: toIsoDateString(doc.createdAt),
    });
  }
  await upsert("usmle_resources", usmleRows);

  const videoDocs = await db.collection("videos").find({}).toArray();
  const videoRows = [];
  for (const doc of videoDocs) {
    let filePath = null;
    let originalName = doc.originalName ?? null;
    let mimeType = doc.mimeType ?? null;
    let size = typeof doc.size === "number" ? doc.size : null;

    if (doc.fileId) {
      const uploaded = await uploadGridFsFile({
        db,
        bucketName: "videos",
        fileId: doc.fileId,
        targetBucket: "videos",
        path: buildStoragePath([doc._id], doc.originalName || `${doc._id}.video`),
      });
      filePath = uploaded?.path ?? null;
      originalName = uploaded?.name ?? originalName;
      mimeType = uploaded?.mimeType ?? mimeType;
      size = uploaded?.size ?? size;
    }

    videoRows.push({
      id: doc._id,
      title: doc.title,
      description: doc.description ?? "",
      youtube_url: doc.youtubeUrl ?? null,
      file_path: filePath,
      original_name: originalName,
      mime_type: mimeType,
      size,
      created_at: toIsoDateString(doc.createdAt),
    });
  }
  await upsert("videos", videoRows);

  console.log("MongoDB to Supabase migration completed.");
} catch (error) {
  console.error("Migration failed.");
  console.error(`Reason: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await mongo.close().catch(() => {});
}
