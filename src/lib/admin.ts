import "server-only";

import { ADMIN_COOKIE_NAME } from "./admin-constants";

type CookiesLike = {
  get(name: string): { value: string } | undefined;
};

function getExpectedAdminToken() {
  const token = (process.env.ADMIN_TOKEN ?? "").trim();
  return token.length ? token : null;
}

/**
 * Determines whether this request is from an admin user.
 *
 * New model: a private token is entered once via URL (?admin=TOKEN).
 * Middleware validates it and stores it in an httpOnly cookie.
 * API routes then rely on that cookie for admin-only operations.
 */
export function isAdminRequest(request: { cookies: CookiesLike }) {
  const expected = getExpectedAdminToken();
  if (!expected) return false;

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;

  return cookie === expected;
}

