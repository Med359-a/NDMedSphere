import "server-only";

import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI (and optionally MONGODB_DB).",
    );
  }
  return uri;
}

export function getMongoDbName() {
  return process.env.MONGODB_DB || "ndmedsphere";
}

export async function getMongoClient(): Promise<MongoClient> {
  if (globalThis.__mongoClientPromise) return globalThis.__mongoClientPromise;

  const client = new MongoClient(getMongoUri(), {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    // Adding reasonable timeouts to prevent long hangs on failed handshakes
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  globalThis.__mongoClientPromise = client.connect().catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    // Reset the promise so subsequent requests can try to reconnect
    globalThis.__mongoClientPromise = undefined;
    throw err;
  });
  return globalThis.__mongoClientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(getMongoDbName());
}

