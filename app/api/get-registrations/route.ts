export async function GET() {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!webhookUrl) {
      return Response.json({
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: "Webhook not configured",
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return Response.json({
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: response.status === 302 || response.status === 301 ? "Deployment needs update" : "Failed to fetch",
      })
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return Response.json({
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: "Invalid response format",
      })
    }

    const data = await response.json()

    return Response.json({
      totalFamilies: data.totalFamilies || 0,
      totalAdults: data.totalAdults || 0,
      totalKids: data.totalKids || 0,
    })
  } catch (error) {
    return Response.json({
      totalFamilies: 0,
      totalAdults: 0,
      totalKids: 0,
      error: "Failed to fetch data",
    })
  }
}
