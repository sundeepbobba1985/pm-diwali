export async function GET() {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("[v0] GOOGLE_SHEETS_WEBHOOK_URL not configured")
      return Response.json({
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: "Webhook not configured",
      })
    }

    console.log("[v0] Fetching registration data from Google Sheets...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("[v0] Google Sheets webhook returned error:", response.status, response.statusText)
      throw new Error(`Failed to fetch from Google Sheets: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] Google Sheets webhook returned non-JSON response:", contentType)
      const text = await response.text()
      console.error("[v0] Response preview:", text.substring(0, 200))
      throw new Error("Google Sheets webhook did not return JSON. Make sure the GET endpoint is configured correctly.")
    }

    const data = await response.json()
    console.log("[v0] Successfully fetched registration data:", data)

    return Response.json({
      totalFamilies: data.totalFamilies || 0,
      totalAdults: data.totalAdults || 0,
      totalKids: data.totalKids || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching registration data:", error)
    return Response.json({
      totalFamilies: 0,
      totalAdults: 0,
      totalKids: 0,
      error: error instanceof Error ? error.message : "Failed to fetch data",
    })
  }
}
