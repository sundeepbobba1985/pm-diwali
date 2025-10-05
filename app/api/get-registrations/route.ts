export async function GET() {
  try {
    const GOOGLE_APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbycymc5GBPNJ6tLfFyn4xjrIjrYq9u3QMI9lPNzSIdiiUTkI418aFvsIq7iuwSGntDYYQ/exec"

    console.log("[v0] GET registrations - calling Google Apps Script")

    const url = `${GOOGLE_APPS_SCRIPT_URL}?action=getRegistrations`

    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "manual", // Handle redirects manually
    })

    // Follow redirects manually up to 3 times
    let redirectCount = 0
    while (response.status === 302 && redirectCount < 3) {
      const location = response.headers.get("location")
      if (!location) break

      console.log(`[v0] Following redirect ${redirectCount + 1} to:`, location)
      response = await fetch(location, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "manual",
      })
      redirectCount++
    }

    if (!response.ok) {
      console.log(`[v0] Google Apps Script returned status ${response.status}, falling back to empty data`)
      return Response.json({
        success: true,
        registrations: [],
        fallback: true,
        message: "Google Sheets temporarily unavailable, showing empty data",
      })
    }

    const responseText = await response.text()
    console.log("[v0] Raw response length:", responseText.length)

    // Check if response is HTML (error page)
    if (responseText.includes("<html>") || responseText.includes("<!DOCTYPE")) {
      console.log("[v0] Received HTML response, falling back to empty data")
      return Response.json({
        success: true,
        registrations: [],
        fallback: true,
        message: "Google Sheets temporarily unavailable, showing empty data",
      })
    }

    const data = JSON.parse(responseText)
    console.log("[v0] Parsed registration data:", data)

    return Response.json({
      success: true,
      registrations: data.participants || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching registrations:", error)
    return Response.json({
      success: true,
      registrations: [],
      fallback: true,
      message: "Google Sheets temporarily unavailable, showing empty data",
    })
  }
}
