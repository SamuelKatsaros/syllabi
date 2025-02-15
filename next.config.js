/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'home.syllabus.website',
            },
          ],
          destination: '/home',
        },
        {
          source: '/favicon.ico',
          has: [
            {
              type: 'host',
              value: '(?<subdomain>[^.]+).syllabus.website',
            },
          ],
          destination: '/api/favicon?subdomain=:subdomain',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?!home)(?<subdomain>[^.]+).syllabus.website',
            },
          ],
          destination: '/:path*?subdomain=:subdomain',
        },
      ],
    };
  },
  images: {
    domains: [
      'localhost',
      'syllabus.website',
      'home.syllabus.website',
      'vercel.app'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.syllabus.website',
      },
      {
        protocol: 'https',
        hostname: 'syllabus.website',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://home.syllabus.website',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 