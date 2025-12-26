import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_QUERY_PARAM } from "./lib/admin-constants";

function getExpectedAdminToken() {
  const token = (process.env.ADMIN_TOKEN ?? "").trim();
  return token.length ? token : null;
}

export function proxy(request: NextRequest) {
  const provided = request.nextUrl.searchParams.get(ADMIN_QUERY_PARAM);
  if (!provided) return NextResponse.next();

  // Always redirect to a clean URL so the secret doesn't remain in the address bar.
  const cleanUrl = request.nextUrl.clone();
  cleanUrl.searchParams.delete(ADMIN_QUERY_PARAM);
  const response = NextResponse.redirect(cleanUrl);

  // Logout shortcut: `?admin=logout`
  if (provided === "logout") {
    response.cookies.delete(ADMIN_COOKIE_NAME);
    return response;
  }

  const expected = getExpectedAdminToken();
  if (!expected) return response;

  if (provided === expected) {
    response.cookies.set(ADMIN_COOKIE_NAME, expected, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

