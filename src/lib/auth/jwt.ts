export type AccessTokenPayload = {
  sub: string
  tenant_id: string
  tenant_name: string
  tenant_slug: string
  role: string
}


// Utility -> decode JWT payload without verification (safe: we only use this
// for claims we just received from our own trusted backend).
export function decodeJwtPayload(
  token: string
): AccessTokenPayload | null {
  try {
    const payload = token.split(".")[1]

    if (!payload) return null

    const json = Buffer.from(payload, "base64url").toString("utf8")
    return JSON.parse(
      json
    )
  } catch {
    return null
  }
}
