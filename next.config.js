/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  webpack: (config) => {
    // Fix build error caused by directory import in swagger-ui-react
    config.resolve.alias['remarkable/linkify'] = 'remarkable/dist/cjs/linkify.js';
    return config;
  },
};

module.exports = nextConfig;
