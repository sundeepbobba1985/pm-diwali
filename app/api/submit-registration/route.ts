import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("[v0] Registration submission received:", data)

    // Google Sheets Web App URL - you'll need to replace this with your actual URL
    const GOOGLE_SHEETS_URL =
      process.env.GOOGLE_SHEETS_URL ||
      "https://script.google.com/macros/s/AKfycbwg9YCJJc1BUNzDI1vbCQ_8nP6XROAeK9KWtxtuhOnvwBbgKkLE_k71tpa8N4muobLcbA/exec"

    const requestPayload = {
      action: "submitRegistration",
      familyName: data.fullName,
      contactPerson: data.fullName, // Keep as same as family name
      email: data.email,
      phone: data.mobile,
      address: data.address,
      adults: Number.parseInt(data.adults) || 0,
      kids: Number.parseInt(data.kids) || 0,
      zelleConfirmation: data.zelleConfirmation || "",
      timestamp: new Date().toISOString(),
      signedInUser: data.signedInUser || "",
    }

    console.log("[v0] Sending registration to Google Sheets:", requestPayload)

    // Send data to Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    })

    console.log("[v0] Google Sheets response status:", response.status)
    const result = await response.text()
    console.log("[v0] Google Sheets response:", result)

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      throw new Error("Failed to submit to Google Sheets")
    }
  } catch (error) {
    console.error("[v0] Registration API Error:", error)
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 })
  }
}
