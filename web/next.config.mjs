/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.childfirst.org" },
      { protocol: "https", hostname: "**.ipfs.io" },
    ],
  },
  // Required for wagmi/viem bundle
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // MetaMask SDK pulls in react-native deps that don't exist in browser builds
    config.resolve.alias["@react-native-async-storage/async-storage"] = false;
    return config;
  },
};

export default nextConfig;
