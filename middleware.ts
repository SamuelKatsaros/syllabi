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

  // Let Next.js handle static files directly
  if (url.pathname.startsWith('/favicons/') || url.pathname.startsWith('/logos/')) {
    return NextResponse.next();
  }

  // Handle favicon.ico requests
  if (url.pathname === '/favicon.ico') {
    const universityId = subdomain ? subdomainToUniversityId(subdomain) : 'default';
    const theme = themes[universityId as keyof typeof themes] || themes.default;
    return NextResponse.rewrite(new URL(theme.favicon, req.url));
  }

  // Regular request handling
  if (!subdomain) {
    subdomain = url.searchParams.get('subdomain') || 'default';
  }

  const universityId = subdomainToUniversityId(subdomain);
  url.searchParams.set("subdomain", subdomain);
  url.searchParams.set("university", universityId);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image|_next/data|favicons|logos).*)',
    '/favicon.ico'
  ]
};
