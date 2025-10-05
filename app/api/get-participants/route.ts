export async function GET() {
  try {
    const GOOGLE_APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbycymc5GBPNJ6tLfFyn4xjrIjrYq9u3QMI9lPNzSIdiiUTkI418aFvsIq7iuwSGntDYYQ/exec"

    console.log("[v0] Fetching participants from:", GOOGLE_APPS_SCRIPT_URL)

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (compatible; v0-app/1.0)",
      },
      body: new URLSearchParams({
        action: "getRegistrations",
      }),
      redirect: "follow",
      cache: "no-cache",
      mode: "cors",
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Final response URL:", response.url)

    if (response.status === 302) {
      const redirectUrl = response.headers.get("location") || response.url
      console.log("[v0] Following redirect to:", redirectUrl)

      const redirectResponse = await fetch(redirectUrl, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      })

      const redirectText = await redirectResponse.text()
      console.log("[v0] Redirect response:", redirectText.substring(0, 200))

      if (redirectText.includes("<html>") || redirectText.includes("<!DOCTYPE")) {
        throw new Error(
          "Google Apps Script deployment issue. Please ensure your script is deployed with 'Execute as: Me' and 'Who has access: Anyone'",
        )
      }

      const data = JSON.parse(redirectText)
      const participants =
        data.registrations?.map((reg) => ({
          name: reg.name,
          email: reg.email,
          adults: Number.parseInt(reg.adults) || 0,
          kids: Number.parseInt(reg.kids) || 0,
          timestamp: reg.timestamp,
        })) || []

      return Response.json({
        success: true,
        participants: participants,
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Error response:", errorText.substring(0, 500))
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseText = await response.text()
    console.log("[v0] Raw response:", responseText.substring(0, 200))

    if (responseText.includes("<html>") || responseText.includes("<!DOCTYPE")) {
      throw new Error(
        "Google Apps Script returned HTML error page. Check your script deployment settings - it should be deployed as 'Anyone' can access.",
      )
    }

    const data = JSON.parse(responseText)
    console.log("[v0] Registration data received:", data)

    const participants =
      data.registrations?.map((reg) => ({
        name: reg.name,
        email: reg.email,
        adults: Number.parseInt(reg.adults) || 0,
        kids: Number.parseInt(reg.kids) || 0,
        timestamp: reg.timestamp,
      })) || []

    return Response.json({
      success: true,
      participants: participants,
    })
  } catch (error) {
    console.error("[v0] Error fetching participants:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to fetch participants",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
