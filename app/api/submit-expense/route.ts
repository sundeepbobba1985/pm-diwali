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

    console.log("Formatted expense data:", expenseData)

    // Send to Google Sheets
    const googleSheetsUrl =
      process.env.GOOGLE_SHEETS_URL ||
      "https://script.google.com/macros/s/AKfycbwg9YCJJc1BUNzDI1vbCQ_8nP6XROAeK9KWtxtuhOnvwBbgKkLE_k71tpa8N4muobLcbA/exec"

    console.log("Sending to Google Sheets URL:", googleSheetsUrl)

    const requestPayload = {
      action: "addExpense",
      data: expenseData,
    }

    console.log("Request payload:", requestPayload)

    const response = await fetch(googleSheetsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    })

    console.log("Google Sheets response status:", response.status)
    console.log("Google Sheets response headers:", Object.fromEntries(response.headers.entries()))

    const result = await response.text()
    console.log("Google Sheets response text:", result)

    // Try to parse as JSON if possible
    let parsedResult
    try {
      parsedResult = JSON.parse(result)
      console.log("Parsed Google Sheets response:", parsedResult)
    } catch (parseError) {
      console.log("Could not parse response as JSON:", parseError)
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
  } catch (error) {
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
