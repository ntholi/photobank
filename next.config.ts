import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    authInterrupts: true,
    browserDebugInfoInTerminal: true,
  },
};

export default nextConfig;
