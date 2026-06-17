const protocol =
  process.env.APP_PROTOCOL ?? "http";

const domain =
  process.env.BASE_DOMAIN ?? "app.local";

const port =
  process.env.APP_PORT
    ? `:${process.env.APP_PORT}`
    : "";

export const appConfig = {
  protocol,

  domain,

  cookieDomain:
    process.env.COOKIE_DOMAIN,

  rootUrl:
    `${protocol}://${domain}${port}`,

  tenantUrl(slug: string) {
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