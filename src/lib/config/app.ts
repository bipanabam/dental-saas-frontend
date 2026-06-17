const protocol =
  process.env.APP_PROTOCOL ?? "http";

const domain =
  process.env.BASE_DOMAIN ?? "app.local";

const port =
  process.env.APP_PORT
    ? `:${process.env.APP_PORT}`
    : "";

const hasCustomDomain = !!process.env.CUSTOM_DOMAIN;

export const appConfig = {
  protocol,
  domain,
  hasCustomDomain,

  cookieDomain:
    process.env.COOKIE_DOMAIN ??
    (process.env.BASE_DOMAIN ? `.${process.env.BASE_DOMAIN}` : undefined),

  rootUrl:
    `${protocol}://${domain}${port}`,

  tenantUrl(slug: string) {
    if (!hasCustomDomain) {
      // No wildcard subdomain support — stay on root domain
      return `${protocol}://${domain}${port}`;
    }
    return `${protocol}://${slug}.${domain}${port}`;
  },

  loginUrl() {
    return `${protocol}://${domain}${port}/login`;
  },

  redirectUrl() {
    return `${protocol}://${domain}${port}/redirect-to-tenant`;
  },

  isProd:
    process.env.NODE_ENV ===
    "production",
};