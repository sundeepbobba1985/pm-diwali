import { NextResponse } from "next/server"

export async function GET() {
  try {
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL

    if (!GOOGLE_SHEETS_URL) {
      console.error("[v0] GOOGLE_SHEETS_URL not configured")
      return NextResponse.json({ error: "Google Sheets not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching participants from:", GOOGLE_SHEETS_URL)

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getRegistrations",
      }),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      throw new Error(`Google Sheets API returned ${response.status}`)
    }

    const result = await response.json()
    console.log("[v0] Participants data:", result)

    return NextResponse.json({
      success: true,
      participants: result.registrations || result.participants || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching participants:", error)
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 })
  }
}
