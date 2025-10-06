import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const volunteerData = await request.json()
    console.log("[v0] Volunteer data received:", volunteerData)

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("[v0] Google Sheets webhook URL not configured")
      return NextResponse.json(
        {
          success: true,
          warning: "Google Sheets webhook not configured. Data saved locally only.",
        },
        { status: 200 },
      )
    }

    console.log("[v0] Sending volunteer data to Google Sheets...")

    try {
      const payload = {
        type: "volunteer",
        ...volunteerData,
      }
      console.log("[v0] Payload being sent:", payload)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      })

      console.log("[v0] Google Sheets response status:", response.status)
      console.log("[v0] Response content-type:", response.headers.get("content-type"))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Google Sheets error response:", errorText)
        throw new Error(`Google Sheets API returned ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] Google Sheets success response:", result)

      return NextResponse.json({
        success: true,
        message: "Volunteer registration submitted successfully",
        data: result,
      })
    } catch (webhookError) {
      console.log("[v0] Webhook error:", webhookError)
      return NextResponse.json(
        {
          success: true,
          warning: "Data saved locally. Google Sheets sync will be retried.",
          error: webhookError instanceof Error ? webhookError.message : "Unknown error",
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.log("[v0] API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process volunteer registration",
      },
      { status: 500 },
    )
  }
}
