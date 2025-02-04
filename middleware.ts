import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import universities from "./themes.json"; // Import themes

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hostname = nextUrl.hostname;
  
  // Extract subdomain (e.g., "stonybrook" from "stonybrook.syllabus.website")
  const subdomain = hostname.split(".")[0];

  // Ensure TypeScript allows indexing into themes.json
  const universitiesTyped: Record<string, { name: string; primaryColor: string; logo: string }> = universities;

  // Find the matching university ID
  const universityId = Object.keys(universitiesTyped).find(
    (id) => universitiesTyped[id].name.toLowerCase().replace(/\s+/g, "") === subdomain
  );

  if (universityId) {
    // Clone request and attach universityId as a custom header
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("X-University-Id", universityId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Enable middleware for all pages
export const config = {
  matcher: "/:path*",
};
