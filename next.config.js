/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  transpilePackages: ['undici', '@firebase/auth', '@firebase/app', '@firebase/firestore', '@firebase/storage'],
  webpack: (config) => {
    // Resolver para lidar com problemas de módulos privados
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false
    };
    return config;
  },
}

module.exports = nextConfig 