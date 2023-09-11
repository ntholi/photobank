/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lehakoe.s3.af-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'djvt9h5y4w4rn.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
