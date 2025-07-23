import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/my-web-function-app',
  assetPrefix: '/my-web-function-app/',
}

export default nextConfig