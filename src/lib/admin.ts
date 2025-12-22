import "server-only";

type HeadersLike = {
  get(name: string): string | null;
};

// Default allowlist. You can extend it at runtime via:
// ADMIN_IP_ALLOWLIST="212.58.103.244,203.0.113.10"
const DEFAULT_ADMIN_IP_ALLOWLIST = ["212.58.103.244", "185.115.7.191"] as const;
const DEV_LOOPBACK_ALLOWLIST =
  process.env.NODE_ENV === "production" ? ([] as const) : (["127.0.0.1", "::1"] as const);

let cachedAllowlist: Set<string> | null = null;

function normalizeIp(raw: string) {
  let ip = raw.trim();
  if (!ip) return "";

  // Strip brackets around IPv6 (e.g. "[::1]:1234")
  if (ip.startsWith("[") && ip.includes("]")) {
    ip = ip.slice(1, ip.indexOf("]"));
  }

  // Strip IPv6 zone id (e.g. "fe80::1%lo0")
  const zoneIndex = ip.indexOf("%");
  if (zoneIndex !== -1) ip = ip.slice(0, zoneIndex);

  // Normalize IPv4-mapped IPv6 (e.g. "::ffff:1.2.3.4")
  if (ip.startsWith("::ffff:")) ip = ip.slice("::ffff:".length);

  // Strip port from IPv4 (e.g. "1.2.3.4:1234")
  const ipv4WithOptionalPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
  if (ipv4WithOptionalPort) return ipv4WithOptionalPort[1];

  return ip;
}

function parseForwardedFor(value: string) {
  return value
    .split(",")
    .map((part) => normalizeIp(part))
    .filter(Boolean);
}

function getAllowlist() {
  if (cachedAllowlist) return cachedAllowlist;

  const extra = (process.env.ADMIN_IP_ALLOWLIST ?? "")
    .split(/[,\s]+/g)
    .map((v) => normalizeIp(v))
    .filter(Boolean);

  cachedAllowlist = new Set(
    [...DEFAULT_ADMIN_IP_ALLOWLIST, ...DEV_LOOPBACK_ALLOWLIST, ...extra].map((v) =>
      normalizeIp(v),
    ),
  );

  return cachedAllowlist;
}

export function getClientIpFromHeaders(headers: HeadersLike): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const ips = parseForwardedFor(xff);
    if (ips.length) return ips[0];
  }

  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const ip = normalizeIp(vercel);
    if (ip) return ip;
  }

  const real = headers.get("x-real-ip");
  if (real) {
    const ip = normalizeIp(real);
    if (ip) return ip;
  }

  const cf = headers.get("cf-connecting-ip");
  if (cf) {
    const ip = normalizeIp(cf);
    if (ip) return ip;
  }

  return null;
}

export function getClientIpFromRequest(request: {
  headers: HeadersLike;
  ip?: string | null;
}): string | null {
  const fromHeaders = getClientIpFromHeaders(request.headers);
  if (fromHeaders) return fromHeaders;

  const fromRequestIp = normalizeIp(request.ip ?? "");
  return fromRequestIp || null;
}

export function isAdminRequest(request: {
  headers: HeadersLike;
  ip?: string | null;
}) {
  const ip = getClientIpFromRequest(request);
  if (!ip) return false;
  return getAllowlist().has(ip);
}

