import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  images: { unoptimized: true },
};

export default nextConfig;
