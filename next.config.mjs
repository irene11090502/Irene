/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: produces a self-contained `out/` folder of HTML/JS/CSS
  // that Electron can serve with no Next server running.
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    // No ESLint config is shipped with this scaffold; skip lint during build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
