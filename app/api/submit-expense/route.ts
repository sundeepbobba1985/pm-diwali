import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received expense data:", body)

    const expenseData = {
      category: body.category,
      description: body.description,
      amount: body.amount,
      date: body.date,
      paidBy: body.paidBy,
      receipt: body.receipt || "",
      submittedBy: body.submittedBy,
      timestamp: body.timestamp,
    }

    const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL

    if (!googleSheetsUrl) {
      throw new Error("GOOGLE_SHEETS_URL not configured")
    }

    const requestPayload = {
      action: "addExpense",
      data: expenseData,
    }

    const response = await fetch(googleSheetsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    })

    const result = await response.text()

    let parsedResult
    try {
      parsedResult = JSON.parse(result)
    } catch (parseError) {
      parsedResult = { rawResponse: result }
    }

    if (!response.ok) {
      throw new Error(`Google Sheets API returned ${response.status}: ${result}`)
    }

    return NextResponse.json({
      success: true,
      message: "Expense recorded successfully",
      result: parsedResult,
    })
  } catch (error: any) {
    console.error("Error submitting expense:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to record expense",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
