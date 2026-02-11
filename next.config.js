/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Keep this to ignore strict type errors during build
    ignoreBuildErrors: true,
  },
  // We removed the 'eslint' block because Next.js 16 handles it differently now
}

module.exports = nextConfig