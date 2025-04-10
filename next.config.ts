/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DICTIONARY_API_URL: process.env.NEXT_PUBLIC_DICTIONARY_API_URL,
  },
  eslint: {
    // Disable ESLint during build for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build for now
    ignoreBuildErrors: true,
  },
  // Add other nextConfig settings here
};

export default nextConfig;
