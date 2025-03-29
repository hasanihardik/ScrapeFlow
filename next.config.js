/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    // Use chrome-aws-lambda and puppeteer-core
    serverComponentsExternalPackages: ['chrome-aws-lambda', 'puppeteer-core'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname),
      '@components': path.join(__dirname, 'components'),
      '@ui': path.join(__dirname, 'components/ui'),
    };
    // No longer need chrome-launcher specific handling
    return config;
  }
};

module.exports = nextConfig;
