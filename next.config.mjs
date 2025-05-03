/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Define which env vars are available to the client
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_REZORPAY_KEY_ID,
  },
  // Explicitly specify which env vars are server-only to prevent exposure
  serverRuntimeConfig: {
    RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_REZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.NEXT_PUBLIC_REZORPAY_SECRET_KEY,
  },
}

export default nextConfig
