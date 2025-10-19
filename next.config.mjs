/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/doc',
        destination: '/docs/getting-started/introduction',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
