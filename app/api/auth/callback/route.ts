import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`

  if (!googleClientId || !googleClientSecret) {
    return NextResponse.redirect(new URL("/?error=config_missing", request.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/?error=token_failed", request.url))
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userResponse.json()

    // Redirect back to home with user info
    const redirectUrl = new URL("/", request.url)
    redirectUrl.searchParams.set("auth_token", tokens.access_token)
    redirectUrl.searchParams.set("user_name", userInfo.name)
    redirectUrl.searchParams.set("user_email", userInfo.email)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("OAuth error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
