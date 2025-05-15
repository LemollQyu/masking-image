// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/results/**",
      },
      {
        protocol: "https",
        hostname: "f68f-157-10-8-185.ngrok-free.app",
        pathname: "/static/results/**",
      },
    ],
  },
};

module.exports = nextConfig;
