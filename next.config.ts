import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",                                                          // 静态导出，适配 GitHub Pages
  images: { unoptimized: true },                                             // GitHub Pages 不支持 Next.js Image 优化
  basePath: "/devblog",                                                      // GitHub Pages 路径前缀
};

export default nextConfig;
