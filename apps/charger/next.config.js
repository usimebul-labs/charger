/** @type {import('next').NextConfig} */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/utils"]
};

export default withPWA(nextConfig);