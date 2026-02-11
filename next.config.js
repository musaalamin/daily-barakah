/** @type {import('next').NextConfig} */
const nextConfig = {
  // THIS IS THE LINE YOU NEED TO ADD:
  basePath: '/daily-barakah',
  
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig