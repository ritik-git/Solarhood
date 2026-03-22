import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "companieslogo.com" },
      { protocol: "https", hostname: "www.waaree.com" },
      { protocol: "https", hostname: "www.vikramsolar.com" },
      { protocol: "https", hostname: "goldisolar.com" },
      { protocol: "https", hostname: "en.si-neng.com" },
      { protocol: "https", hostname: "premiersolar.com" },
    ],
  },
};

export default nextConfig;
