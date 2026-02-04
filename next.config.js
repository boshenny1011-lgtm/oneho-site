const nextConfig = {
  images: {
    unoptimized: true,
  },
  // 在构建时忽略 ESLint（只在本地开发时提示）
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig