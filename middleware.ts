import { NextRequest, NextResponse } from "next/server";
import universities from "./themes.json"; // Ensure university data is available

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0]; // Extract subdomain (e.g., "stonybrook" from "stonybrook.syllabus.website")

  console.log(`Incoming request to: ${host} | Extracted subdomain: ${subdomain}`);

  // If it's the main domain, continue as usual
  if (!subdomain || subdomain === "www" || subdomain === "syllabus") {
    console.log("Main domain detected, skipping subdomain logic.");
    return NextResponse.next();
  }

  // Match subdomain to a university in themes.json
  const universityEntry = Object.entries(universities).find(([id, data]) => {
    return data.name.toLowerCase().replace(/\s+/g, "") === subdomain;
  });

  if (!universityEntry) {
    console.log("No matching university found for subdomain:", subdomain);
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  const universityId = universityEntry[0];

  console.log(`Mapped subdomain ${subdomain} -> University ID: ${universityId}`);

  // Rewrite request with university ID
  const newUrl = new URL(req.url);
  newUrl.searchParams.set("university", universityId);

  console.log(`Rewriting request to: ${newUrl.toString()}`);

  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: "/:path*",
};
