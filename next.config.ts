import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */


const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
});


const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};


module.exports = withPWA(nextConfig);
