/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tile.openstreetmap.org', 'server.arcgisonline.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'GeoResource AI Explorer',
  },
}

module.exports = nextConfig