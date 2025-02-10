/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
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
    domains: ['home.syllabus.website'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.syllabus.website',
      },
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