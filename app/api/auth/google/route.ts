import { NextResponse } from "next/server"

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`

  if (!googleClientId) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 })
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  })}`

  return NextResponse.redirect(googleAuthUrl)
}
