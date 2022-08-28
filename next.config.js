/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.dev1.mintoon.io' }],
      destination: 'https://dev1.mintoon.io/:path*',
      permanent: true
    }
  ]
}

module.exports = nextConfig
