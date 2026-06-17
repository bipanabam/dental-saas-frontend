import type { NextConfig } from "next"
import { appConfig } from "@/lib/config/app";

const rootDomain = appConfig.domain;

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "app.local",
    "*.app.local",
  ],
  async rewrites() {
    // Subdomain rewrites only work with a custom domain
    if (!appConfig.hasCustomDomain) return { beforeFiles: [] };
    return {
      beforeFiles: [
        {
          source: "/:path((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)*",
          has: [
            { 
              type: "host", 
              value: `(?<slug>[^.]+)\\.${rootDomain}`,
            }
          ],
          destination: "/:path*",
        },
      ],
    }
  },
  reactCompiler: true,
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
}

export default nextConfig;