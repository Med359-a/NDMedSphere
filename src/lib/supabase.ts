import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKETS = {
  books: "books",
  caseQuizImages: "case-quiz-images",
  doctorsImages: "doctors-images",
  medicalNewsImages: "medical-news-images",
  usmleFiles: "usmle-files",
  videos: "videos",
} as const;

let supabaseAdmin: SupabaseClient | undefined;

function getSupabaseUrl() {
  const value = (process.env.SUPABASE_URL ?? "").trim();
  if (!value) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return value;
}

function getSupabaseServiceRoleKey() {
  const value = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!value) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return value;
}

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

export function getStoragePublicUrl(bucket: string, path: string, downloadName?: string) {
  const { data } = getSupabaseAdmin().storage.from(bucket).getPublicUrl(path);
  const url = new URL(data.publicUrl);

  if (downloadName) {
    url.searchParams.set("download", downloadName);
  }

  return url.toString();
}

export async function uploadStorageObject(
  bucket: string,
  path: string,
  file: File,
  options: { upsert?: boolean } = {},
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await getSupabaseAdmin().storage.from(bucket).upload(path, buffer, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: options.upsert ?? false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function removeStorageObject(bucket: string, path?: string | null) {
  if (!path) return;

  const { error } = await getSupabaseAdmin().storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}
