/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // pdf-parse must stay a runtime require (bundling breaks its internals)
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

module.exports = nextConfig;
