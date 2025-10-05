export async function GET() {
  try {
    console.log("[v0] Simple participants API called")

    // For now, return mock data since we can't easily retrieve from Google Sheets
    // In a real implementation, you would need to set up proper data retrieval
    const mockParticipants = [
      {
        name: "Sample Participant 1",
        adults: 2,
        kids: 1,
        timestamp: new Date().toISOString(),
      },
      {
        name: "Sample Participant 2",
        adults: 3,
        kids: 2,
        timestamp: new Date().toISOString(),
      },
    ]

    return Response.json({
      success: true,
      registrations: mockParticipants,
    })
  } catch (error) {
    console.error("[v0] Error in simple participants API:", error)
    return Response.json({ success: false, error: "Failed to fetch participants" }, { status: 500 })
  }
}
