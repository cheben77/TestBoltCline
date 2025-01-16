/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ollama/:path*',
        destination: 'http://127.0.0.1:11434/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
