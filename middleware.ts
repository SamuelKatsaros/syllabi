import { NextRequest, NextResponse } from 'next/server';
import { subdomainToUniversityId } from '@/utils/universityMappings';
import themes from './themes.json';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  let subdomain: string | undefined;

  const hostname = req.headers.get('host');
  if (hostname && hostname !== 'localhost:3000') {
    const parts = hostname.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  if (!subdomain) {
    subdomain = url.searchParams.get('subdomain') || undefined;
  }

  // Handle favicon requests
  if (url.pathname === '/favicon.ico' || url.pathname.startsWith('/favicons/')) {
    const universityId = subdomainToUniversityId(subdomain || '');
    const theme = themes[universityId as keyof typeof themes] || themes.default;
    
    // Rewrite to the correct favicon path
    url.pathname = theme.favicon;
    return NextResponse.rewrite(url);
  }

  // Regular request handling
  if (!subdomain) {
    return NextResponse.json({ error: "Subdomain missing" }, { status: 400 });
  }

  const universityId = subdomainToUniversityId(subdomain);
  url.searchParams.set("subdomain", subdomain);
  url.searchParams.set("university", universityId);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image).*)',
    '/favicon.ico',
    '/favicons/:path*'
  ],
};
