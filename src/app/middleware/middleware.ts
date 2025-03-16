import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url)); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };

    // Clone request headers and append user data
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("X-User-Id", decoded.userId);
    requestHeaders.set("X-Email", decoded.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL("/auth", req.url)); // Redirect if token is invalid
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], 
};
