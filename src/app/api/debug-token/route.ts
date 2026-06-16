// app/api/debug-token/route.ts  ← DELETE BEFORE PRODUCTION
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  return NextResponse.json({
    hasRefreshToken: !!session?.refreshToken,
    refreshTokenLength: session?.refreshToken?.length,
    expiresAt: session?.accessTokenExpiresAt 
      ? new Date(session.accessTokenExpiresAt).toISOString() 
      : null,
    isExpired: session?.accessTokenExpiresAt 
      ? Date.now() > session.accessTokenExpiresAt 
      : null,
  })
}