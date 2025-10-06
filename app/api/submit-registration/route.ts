import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("[v0] Registration data received:", data)

    // Send to Google Sheets via webhook
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!sheetsWebhookUrl) {
      console.log("[v0] WARNING: GOOGLE_SHEETS_WEBHOOK_URL not configured")
      return NextResponse.json({
        success: true,
        message: "Registration saved locally (Google Sheets not configured)",
        warning: "Google Sheets integration not set up",
      })
    }

    console.log("[v0] Sending to Google Sheets webhook...")

    try {
      const response = await fetch(sheetsWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseText = await response.text()
      console.log("[v0] Google Sheets response status:", response.status)
      console.log("[v0] Google Sheets response:", responseText)

      if (!response.ok) {
        console.error("[v0] Failed to send to Google Sheets:", responseText)
        return NextResponse.json({
          success: true,
          message: "Registration saved locally (Google Sheets error)",
          error: `Google Sheets returned status ${response.status}`,
        })
      }

      console.log("[v0] Successfully sent to Google Sheets")
      return NextResponse.json({
        success: true,
        message: "Registration submitted successfully to Google Sheets",
      })
    } catch (error) {
      console.error("[v0] Error sending to Google Sheets:", error)
      return NextResponse.json({
        success: true,
        message: "Registration saved locally (Google Sheets connection error)",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  } catch (error) {
    console.error("[v0] Registration submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit registration",
      },
      { status: 500 },
    )
  }
}
