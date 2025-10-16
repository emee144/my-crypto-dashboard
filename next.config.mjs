import path from "path";
import { fileURLToPath } from "url";

/** Fix for `__dirname` in ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// trigger redeploy
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src/app"), // Define the '@' alias
    };

    // Fix Sequelize's "Critical dependency" warning
    config.module.exprContextCritical = false;

    return config;
  },
  images: {
    domains: ['cryptologos.cc'], // Allow images from cryptologos.cc
  },
};

export default nextConfig;