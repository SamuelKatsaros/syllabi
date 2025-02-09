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
              value: '(?<subdomain>[^.]+).syllabus.website',
            },
          ],
          destination: '/:path*?subdomain=:subdomain',
        },
      ],
    };
  },
};

module.exports = nextConfig; 