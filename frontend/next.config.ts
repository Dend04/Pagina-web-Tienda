import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
  },
};


export default nextConfig;
