import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] VOLUNTEER API CALLED - Starting volunteer submission")

  try {
    const body = await request.json()
    console.log("[v0] Volunteer data received:", body)

    const googleSheetsUrl =
      "https://script.google.com/macros/s/AKfycbycymc5GBPNJ6tLfFyn4xjrIjrYq9u3QMI9lPNzSIdiiUTkI418aFvsIq7iuwSGntDYYQ/exec"

    const requestPayload = {
      action: "addVolunteer",
      name: body.name || "",
      email: body.email || "",
      volunteerType: body.volunteerType || "",
      cleanupDate: body.cleanupDate || "",
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Sending to Google Apps Script with JSON:", requestPayload)

    const response = await fetch(googleSheetsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    })

    console.log("[v0] Google Apps Script response status:", response.status)
    const result = await response.text()
    console.log("[v0] Google Apps Script response:", result)

    if (response.ok) {
      console.log("[v0] Volunteer successfully submitted to Google Sheets")
      return NextResponse.json({
        success: true,
        message: "Volunteer registration submitted successfully",
      })
    } else {
      console.error("[v0] Google Apps Script error:", response.status)
      throw new Error(`Google Apps Script error: ${response.status}`)
    }
  } catch (error) {
    console.error("[v0] Volunteer submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit volunteer registration",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Volunteer API is working",
    timestamp: new Date().toISOString(),
  })
}
