import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @af/ui se consume como código fuente TS.
  transpilePackages: ['@af/ui'],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
