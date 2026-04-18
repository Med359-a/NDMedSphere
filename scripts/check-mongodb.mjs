import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { MongoClient, ServerApiVersion } from "mongodb";

function loadEnvFile(filename) {
  const fullPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(fullPath)) return false;

  const contents = fs.readFileSync(fullPath, "utf8");
  for (const line of contents.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      const commentIndex = value.indexOf(" #");
      if (commentIndex >= 0) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    process.env[key] = value.replace(/\\n/g, "\n");
  }

  return true;
}

const loadedFiles = [".env.local", ".env"].filter(loadEnvFile);
const uri = (process.env.MONGODB_URI ?? "").trim();
const dbName = (process.env.MONGODB_DB ?? "ndmedsphere").trim() || "ndmedsphere";

if (!uri) {
  console.error("MongoDB check failed.");
  console.error(
    "Reason: Missing MONGODB_URI. Copy env.example to .env.local and set real values.",
  );
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

try {
  await client.connect();

  const db = client.db(dbName);
  await db.command({ ping: 1 });
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();

  console.log("MongoDB check succeeded.");
  if (loadedFiles.length) {
    console.log(`Loaded env: ${loadedFiles.join(", ")}`);
  }
  console.log(`Database: ${db.databaseName}`);
  console.log(
    `Collections: ${
      collections.length
        ? collections.map((collection) => collection.name).sort().join(", ")
        : "(none yet)"
    }`,
  );
} catch (error) {
  console.error("MongoDB check failed.");
  if (loadedFiles.length) {
    console.error(`Loaded env: ${loadedFiles.join(", ")}`);
  }
  console.error(`Database: ${dbName}`);
  console.error(
    `Reason: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
