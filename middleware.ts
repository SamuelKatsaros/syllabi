import { NextRequest, NextResponse } from 'next/server';
import { subdomainToUniversityId } from '@/utils/universityMappings';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  let subdomain: string | undefined;

  // First try to get subdomain from host
  const hostname = req.headers.get('host');
  if (hostname && hostname !== 'localhost:3000') {
    const parts = hostname.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  // Fallback to query parameter if no subdomain found in hostname
  if (!subdomain) {
    subdomain = url.searchParams.get('subdomain') || undefined;
  }

  console.log("Middleware - Detected Subdomain:", subdomain);

  if (!subdomain) {
    return NextResponse.json({ error: "Subdomain missing" }, { status: 400 });
  }

  // Use the centralized mapping
  const universityId = subdomainToUniversityId(subdomain);
  
  // Rewrite the request to include both subdomain and university
  url.searchParams.set("subdomain", subdomain);
  url.searchParams.set("university", universityId);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image).*)',
  ],
};
