import type { NextConfig } from "next"

const rootDomain =
  process.env.BASE_DOMAIN ??
  "app.local";

const hasSubdomainRouting =
  process.env.APP_SUBDOMAIN_ROUTING === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "app.local",
    "*.app.local",
  ],
  async rewrites() {
    // Subdomain rewrites only work with a custom domain
    if (hasSubdomainRouting) return { beforeFiles: [] };
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
  // output: "standalone",
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