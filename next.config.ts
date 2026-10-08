import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/webp'] },
  turbopack: { root: __dirname },
}

export default nextConfig
