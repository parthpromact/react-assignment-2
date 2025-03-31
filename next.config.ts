import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      ignored: /node_modules/,
      poll: 1000, // Try increasing the poll interval if HMR issues persist
    };
    return config;
  },
};

export default nextConfig;
