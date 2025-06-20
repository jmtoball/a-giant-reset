import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [new URL('https://images.ctfassets.net/**')],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
