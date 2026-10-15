import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dockerで動かすために、本番で必要なファイルだけを .next/standalone にまとめて出力する
  output: "standalone",
};

export default nextConfig;
