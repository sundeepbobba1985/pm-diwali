import { NextResponse } from "next/server"

export async function GET() {
  try {
    const googleSheetsUrl =
      process.env.GOOGLE_SHEETS_URL ||
      "https://script.google.com/macros/s/AKfycbwg9YCJJc1BUNzDI1vbCQ_8nP6XROAeK9KWtxtuhOnvwBbgKkLE_k71tpa8N4muobLcbA/exec"

    console.log("Fetching expenses from Google Sheets URL:", googleSheetsUrl)

    const requestUrl = `${googleSheetsUrl}?action=getExpenses`
    console.log("Full request URL:", requestUrl)

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      redirect: "follow",
    })

    console.log("Google Sheets response status:", response.status)
    console.log("Google Sheets response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.log("Google Sheets API returned non-OK status, falling back to empty expenses")
      return NextResponse.json({
        success: true,
        expenses: [],
        message: "No expenses data available",
      })
    }

    const responseText = await response.text()
    console.log("Google Sheets response text:", responseText.substring(0, 200) + "...")

    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
      console.log(
        "Google Apps Script returned HTML error page instead of JSON. Check your script deployment and doGet function.",
      )
      return NextResponse.json({
        success: true,
        expenses: [],
        message: "Google Sheets temporarily unavailable",
      })
    }

    let result
    try {
      result = JSON.parse(responseText)
      console.log("Parsed Google Sheets response:", result)
    } catch (parseError) {
      console.error("Could not parse response as JSON:", parseError)
      return NextResponse.json({
        success: true,
        expenses: [],
        message: "Unable to parse expenses data",
      })
    }

    return NextResponse.json({
      success: true,
      expenses: result.expenses || [],
      message: result.message || "Expenses fetched successfully",
    })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({
      success: true,
      expenses: [],
      message: "Expenses temporarily unavailable",
    })
  }
}
