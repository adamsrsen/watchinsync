/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/rooms/page',
        destination: '/rooms',
        permanent: true
      },
      {
        source: '/rooms/search',
        destination: '/rooms',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
