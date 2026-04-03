/** @type {import('next').NextConfig} */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils"],
};

export default nextConfig;
