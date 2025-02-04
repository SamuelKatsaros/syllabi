import { NextRequest, NextResponse } from "next/server";
import universities from "./themes.json"; // Ensure university data is available

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0]; // Extract subdomain (e.g., "stonybrook" from "stonybrook.syllabus.website")

  if (!subdomain || subdomain === "www" || subdomain === "syllabus") {
    return NextResponse.next(); // Let main domain requests continue normally
  }

  const universityEntry = Object.entries(universities).find(([id, data]) => {
    return data.name.toLowerCase().replace(/\s+/g, "") === subdomain;
  });

  if (!universityEntry) {
    return NextResponse.rewrite(new URL("/404", req.url)); // Redirect if no match found
  }

  const universityId = universityEntry[0];

  // Rebuild the request URL with the correct university_id
  const newUrl = new URL(req.url);
  newUrl.searchParams.set("university", universityId);

  return NextResponse.rewrite(newUrl);
}

// Enable middleware for all routes
export const config = {
  matcher: "/:path*", // Applies to all routes
};
