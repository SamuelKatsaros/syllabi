import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const hostname = req.headers.get('host') || '';
  
  // Special handling for localhost
  const isLocalhost = hostname.includes('localhost');
  const subdomain = isLocalhost
    ? url.searchParams.get('subdomain') || 'default' // Fallback for localhost
    : hostname.split('.')[0]; // Extract subdomain from real domain

  console.log('Middleware - Host:', hostname);
  console.log('Middleware - Extracted Subdomain:', subdomain);

  if (!isLocalhost) {
    url.searchParams.set('subdomain', subdomain);
  }

  return NextResponse.rewrite(url);
}
