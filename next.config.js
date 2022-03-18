/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/rooms',
        destination: '/rooms/page/1',
        permanent: true
      },
      {
        source: '/rooms/page',
        destination: '/rooms/page/1',
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
