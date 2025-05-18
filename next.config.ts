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
        hostname: "d64d-157-20-244-151.ngrok-free.app",
        pathname: "/static/results/**",
      },
    ],
  },
};

module.exports = nextConfig;
