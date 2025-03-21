/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true, // Ignore les erreurs ESLint pendant le build
    },
  };
  
  module.exports = nextConfig;