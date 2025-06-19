/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [new URL('https://images.ctfassets.net/**')],
  },
};

export default nextConfig;
