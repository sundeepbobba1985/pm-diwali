import { NextResponse } from "next/server"

export async function GET() {
  try {
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL

    if (!GOOGLE_SHEETS_URL) {
      return NextResponse.json({
        success: false,
        error: "Google Sheets not configured",
      })
    }

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getRegistrations",
      }),
    })

    if (!response.ok) {
      throw new Error(`Google Sheets API returned ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      registrations: result.registrations || result.participants || [],
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch registrations",
    })
  }
}
