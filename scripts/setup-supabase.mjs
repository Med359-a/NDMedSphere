import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { loadEnvFiles } from "./lib/load-env.mjs";

const loadedFiles = loadEnvFiles();
const supabaseUrl = (process.env.SUPABASE_URL ?? "").trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
const supabaseDbUrl = (process.env.SUPABASE_DB_URL ?? "").trim();

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseDbUrl) {
  console.error("Supabase setup failed.");
  console.error(
    "Reason: Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SUPABASE_DB_URL.",
  );
  process.exit(1);
}

const sqlPath = path.join(process.cwd(), "supabase", "schema.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

const pgClient = new Client({ connectionString: supabaseDbUrl });
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const buckets = [
  "books",
  "case-quiz-images",
  "medical-news-images",
  "usmle-files",
  "videos",
];

try {
  await pgClient.connect();
  await pgClient.query(sql);

  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const existingNames = new Set((existingBuckets ?? []).map((bucket) => bucket.name));
  for (const bucket of buckets) {
    const { error } = existingNames.has(bucket)
      ? await supabase.storage.updateBucket(bucket, { public: true })
      : await supabase.storage.createBucket(bucket, { public: true });
    if (error) throw error;
  }

  console.log("Supabase setup completed.");
  if (loadedFiles.length) {
    console.log(`Loaded env: ${loadedFiles.join(", ")}`);
  }
  console.log("Schema applied and storage buckets ensured.");
} catch (error) {
  console.error("Supabase setup failed.");
  console.error(`Reason: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await pgClient.end().catch(() => {});
}
