/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    // Include both puppeteer and puppeteer-core
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core'],
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
    // Ensure chrome-launcher is handled correctly if puppeteer uses it internally
    if (isServer) {
      config.externals.push('chrome-launcher');
    }
    return config;
  }
};

module.exports = nextConfig;
