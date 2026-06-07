/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  distDir: "build_dev",
};

export default nextConfig;
