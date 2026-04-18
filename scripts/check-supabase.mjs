import process from "node:process";
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { loadEnvFiles } from "./lib/load-env.mjs";

const loadedFiles = loadEnvFiles();
const supabaseUrl = (process.env.SUPABASE_URL ?? "").trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
const supabaseDbUrl = (process.env.SUPABASE_DB_URL ?? "").trim();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase check failed.");
  console.error(
    "Reason: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy env.example to .env.local and set real values.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

let pgClient;

try {
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) throw bucketError;

  if (supabaseDbUrl) {
    pgClient = new Client({ connectionString: supabaseDbUrl });
    await pgClient.connect();

    const result = await pgClient.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in (
          'books',
          'case_topics',
          'case_quizzes',
          'case_quiz_answers',
          'medical_news',
          'usmle_resources',
          'videos'
        )
      order by table_name
    `);

    console.log("Supabase check succeeded.");
    if (loadedFiles.length) {
      console.log(`Loaded env: ${loadedFiles.join(", ")}`);
    }
    console.log(
      `Buckets: ${buckets.map((bucket) => bucket.name).sort().join(", ") || "(none)"}`,
    );
    console.log(
      `Tables: ${result.rows.map((row) => row.table_name).join(", ") || "(schema not applied yet)"}`,
    );
  } else {
    console.log("Supabase connectivity succeeded.");
    if (loadedFiles.length) {
      console.log(`Loaded env: ${loadedFiles.join(", ")}`);
    }
    console.log(
      `Buckets: ${buckets.map((bucket) => bucket.name).sort().join(", ") || "(none)"}`,
    );
    console.log("Set SUPABASE_DB_URL as well if you want schema verification.");
  }
} catch (error) {
  console.error("Supabase check failed.");
  if (loadedFiles.length) {
    console.error(`Loaded env: ${loadedFiles.join(", ")}`);
  }
  console.error(`Reason: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await pgClient?.end().catch(() => {});
}
