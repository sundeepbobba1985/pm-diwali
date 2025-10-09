export async function GET() {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (!webhookUrl) {
      return Response.json(
        {
          totalFamilies: 0,
          totalAdults: 0,
          totalKids: 0,
          error: "Webhook not configured",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        },
      )
    }

    // Retry logic with exponential backoff
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(webhookUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle 429 rate limit errors with retry
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After")
          const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000 // Exponential backoff: 1s, 2s, 4s

          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue // Retry
          }

          return Response.json(
            {
              totalFamilies: 0,
              totalAdults: 0,
              totalKids: 0,
              error: "Service temporarily unavailable. Please try again in a moment.",
            },
            {
              status: 429,
              headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
              },
            },
          )
        }

        if (!response.ok) {
          return Response.json(
            {
              totalFamilies: 0,
              totalAdults: 0,
              totalKids: 0,
              error: response.status === 302 || response.status === 301 ? "Deployment needs update" : "Failed to fetch",
            },
            {
              headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
              },
            },
          )
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          return Response.json(
            {
              totalFamilies: 0,
              totalAdults: 0,
              totalKids: 0,
              error: "Invalid response format",
            },
            {
              headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
              },
            },
          )
        }

        const data = await response.json()

        return Response.json(
          {
            totalFamilies: data.totalFamilies || 0,
            totalAdults: data.totalAdults || 0,
            totalKids: data.totalKids || 0,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
          },
        )
      } catch (error) {
        lastError = error as Error
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }
      }
    }

    return Response.json(
      {
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: "Failed to fetch data. Please try again later.",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    )
  } catch (error) {
    return Response.json(
      {
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        error: "Failed to fetch data",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    )
  }
}
