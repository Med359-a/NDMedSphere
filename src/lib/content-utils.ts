export function toIsoDateString(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
  }

  return "";
}

export function normalizeUrl(value: string) {
  const v = value.trim();
  if (!v) return "";

  try {
    return new URL(v).toString();
  } catch {
    return "";
  }
}

export function parseTags(input: unknown) {
  const values = Array.isArray(input)
    ? input.map((value) => String(value))
    : typeof input === "string"
      ? input.split(",")
      : [];

  const cleaned = values
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.slice(0, 40));

  return Array.from(new Set(cleaned)).slice(0, 12);
}

function sanitizeSegment(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";
}

export function buildStoragePath(parts: string[], fileName: string) {
  const safeParts = parts.map((part) => sanitizeSegment(String(part))).filter(Boolean);
  return [...safeParts, sanitizeSegment(fileName || "file")].join("/");
}
