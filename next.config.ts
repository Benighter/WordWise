/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DICTIONARY_API_URL: process.env.NEXT_PUBLIC_DICTIONARY_API_URL,
  },
  // Add other nextConfig settings here
};

export default nextConfig;
