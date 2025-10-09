import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export const dynamic = "force-dynamic"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function GET() {
  try {
    const count = await redis.incr("visitor_count")

    return NextResponse.json({
      count,
      success: true,
    })
  } catch (error) {
    console.error("Error tracking visitor count:", error)
    return NextResponse.json({ error: "Failed to track visitor count", count: 0 }, { status: 500 })
  }
}
