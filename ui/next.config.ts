import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@synthify/proto-ts'],
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  images: { unoptimized: true },
};

export default nextConfig;
