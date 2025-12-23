/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  i18n,
  // Enable optimizations for Vercel serverless
  swcMinify: true, // Enable minification
  output: 'standalone', // Optimize for serverless deployment
  experimental: {
    // These settings help reduce bundle size
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize large dependencies that don't need to be bundled
      config.externals = [...(config.externals || []), 'bcrypt', 'formidable', 'multer']
    }
    
    return config
  },
}

module.exports = nextConfig
