import { NextRequest, NextResponse } from 'next/server';

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

  // Rewrite the request to include the subdomain
  url.searchParams.set("subdomain", subdomain);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
