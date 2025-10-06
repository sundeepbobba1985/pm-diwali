import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 400 })
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to get user info" }, { status: 400 })
    }

    return NextResponse.json({
      name: userData.name,
      email: userData.email,
      access_token: tokenData.access_token,
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/?error=no_code", request.url))
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const url = new URL(request.url)
    const redirectUri = `${url.protocol}//${url.host}/api/auth/google`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/?error=config_error", request.url))
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData)
      return NextResponse.redirect(new URL("/?error=token_failed", request.url))
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error("User info failed:", userData)
      return NextResponse.redirect(new URL("/?error=user_info_failed", request.url))
    }

    const params = new URLSearchParams({
      name: userData.name,
      email: userData.email,
      authenticated: "true",
    })

    return NextResponse.redirect(new URL(`/?${params.toString()}`, request.url))
  } catch (error) {
    console.error("Google OAuth GET error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
