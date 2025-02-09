/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Handle favicon.ico requests
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
        // Existing subdomain handling
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