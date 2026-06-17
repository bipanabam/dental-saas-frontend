import type { NextConfig } from "next"

const rootDomain = process.env.NODE_ENV === "production" ? "dentalsaas.com" : "app.local";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "app.local",
    "*.app.local",
  ],
  async rewrites() {
    // if (process.env.NODE_ENV !== "development") return []
    return {
      beforeFiles: [
        {
          source: "/:path((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)*",
          has: [
            { 
              type: "host", 
              value: `(?<slug>.+)\\.${rootDomain}`,
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