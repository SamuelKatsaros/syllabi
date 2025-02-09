/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
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