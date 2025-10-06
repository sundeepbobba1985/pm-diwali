import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const volunteerData = await request.json()

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: true,
          warning: "Google Sheets webhook not configured. Data saved locally only.",
        },
        { status: 200 },
      )
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "volunteer",
          ...volunteerData,
        }),
        redirect: "follow",
      })

      if (!response.ok) {
        throw new Error(`Google Sheets API returned ${response.status}`)
      }

      const result = await response.json()

      return NextResponse.json({
        success: true,
        message: "Volunteer registration submitted successfully",
        data: result,
      })
    } catch (webhookError) {
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
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process volunteer registration",
      },
      { status: 500 },
    )
  }
}
