/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // pdfjs-dist tries to require the optional node "canvas" package
    config.resolve.alias.canvas = false;
    return config;
  },
};
module.exports = nextConfig;
