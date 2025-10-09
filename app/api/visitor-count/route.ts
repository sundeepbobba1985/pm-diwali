import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

let visitorCount = 0

export async function GET() {
  try {
    // Increment the visitor count
    visitorCount++

    return NextResponse.json({
      count: visitorCount,
      success: true,
    })
  } catch (error) {
    console.error("Error tracking visitor count:", error)
    return NextResponse.json({ error: "Failed to track visitor count", count: visitorCount }, { status: 500 })
  }
}
