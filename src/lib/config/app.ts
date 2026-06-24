const protocol = process.env.APP_PROTOCOL ?? "http";
const domain   = process.env.BASE_DOMAIN ?? "app.local";
const port     = process.env.APP_PORT ? `:${process.env.APP_PORT}` : "";

const hasSubdomainRouting =
  process.env.APP_SUBDOMAIN_ROUTING === "true";

// Derive isProd from APP_ENV
const isProd =
  process.env.APP_ENV === "production";

export const appConfig = {
  protocol,
  domain,
  port,
  hasSubdomainRouting,
  isProd,

  // Cookie domain must be the eTLD+1 with a leading dot for subdomain sharing.
  // Explicitly undefined → NextAuth defaults to host-only (breaks subdomains).
  cookieDomain:
    process.env.AUTH_COOKIE_DOMAIN ??
    (domain ? `.${domain}` : undefined),

  get rootUrl() {
    return `${protocol}://${domain}${port}`;
  },

  tenantUrl(slug: string) {
    if (!hasSubdomainRouting) return this.rootUrl;
    return `${protocol}://${slug}.${domain}${port}`;
  },

  loginUrl() {
    return `${this.rootUrl}/login`;
  },

  redirectUrl() {
    return `${this.rootUrl}/redirect-to-tenant`;
  },
} as const;