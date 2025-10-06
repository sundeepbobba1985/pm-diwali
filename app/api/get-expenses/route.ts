import { NextResponse } from "next/server"

export async function GET() {
  try {
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL

    if (!googleSheetsUrl) {
      return NextResponse.json({
        success: true,
        expenses: [],
        message: "Google Sheets not configured",
      })
    }

    const requestUrl = `${googleSheetsUrl}?action=getExpenses`

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      redirect: "follow",
    })

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        expenses: [],
        message: "No expenses data available",
      })
    }

    const responseText = await response.text()

    let expenses = []
    try {
      const parsed = JSON.parse(responseText)
      expenses = parsed.expenses || parsed.data || []
    } catch (parseError) {
      console.error("Failed to parse expenses:", parseError)
    }

    return NextResponse.json({
      success: true,
      expenses,
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({
      success: true,
      expenses: [],
      message: "Error fetching expenses",
    })
  }
}
