import { type NextRequest, NextResponse } from "next/server"

const participantsData: any[] = []

// GET - Retrieve all participants
export async function GET() {
  try {
    console.log("[v0] GET participants - current data:", participantsData)

    // Calculate dashboard stats
    const stats = participantsData.reduce(
      (acc: any, participant: any) => {
        acc.totalFamilies += 1
        acc.totalAdults += Number.parseInt(participant.adults) || 0
        acc.totalKids += Number.parseInt(participant.kids) || 0
        return acc
      },
      { totalFamilies: 0, totalAdults: 0, totalKids: 0 },
    )

    console.log("[v0] Calculated stats:", stats)

    return NextResponse.json({
      success: true,
      participants: participantsData,
      stats,
    })
  } catch (error) {
    console.error("[v0] Error in GET participants:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve participants" }, { status: 500 })
  }
}

// POST - Add new participant
export async function POST(request: NextRequest) {
  try {
    const newParticipant = await request.json()
    console.log("[v0] POST participants - received data:", newParticipant)

    // Add timestamp and ID
    const participant = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newParticipant,
    }

    participantsData.push(participant)
    console.log("[v0] Added participant, total count:", participantsData.length)

    return NextResponse.json({ success: true, participant })
  } catch (error) {
    console.error("[v0] Error in POST participants:", error)
    return NextResponse.json({ success: false, error: "Failed to add participant" }, { status: 500 })
  }
}
