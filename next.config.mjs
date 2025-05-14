/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_REZORPAY_KEY_ID,
  },
  // Explicitly specify which env vars are server-only to prevent exposure
  serverRuntimeConfig: {
    RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_REZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.NEXT_PUBLIC_REZORPAY_SECRET_KEY,
  },
  images: {
    domains: [
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "nyc.cloud.appwrite.io",
    ],
  },
};

export default nextConfig;
  