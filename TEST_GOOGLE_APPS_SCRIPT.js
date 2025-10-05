// Mock declarations for linting - REMOVE THESE LINES when copying to Google Apps Script
const SpreadsheetApp = {}
const ContentService = {}

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====
// This test script will show us what's actually in your Registration sheet

function doPost(e) {
  try {
    const action = e.parameter.action || "unknown"
    console.log("Action received:", action)

    if (action === "getRegistrations") {
      // Get the spreadsheet
      const ss = SpreadsheetApp.getActiveSpreadsheet()
      console.log("Spreadsheet name:", ss.getName())

      // List all sheets
      const sheets = ss.getSheets()
      console.log(
        "Available sheets:",
        sheets.map((sheet) => sheet.getName()),
      )

      // Try to find Registration sheet
      let sheet = ss.getSheetByName("Registration")
      if (!sheet) {
        sheet = ss.getSheetByName("Registrations")
      }
      if (!sheet) {
        sheet = sheets[0] // Use first sheet
      }

      console.log("Using sheet:", sheet.getName())

      // Get all data
      const range = sheet.getDataRange()
      const values = range.getValues()
      console.log("Total rows:", values.length)
      console.log("Headers (row 1):", values[0])

      if (values.length > 1) {
        console.log("Sample data (row 2):", values[1])
      }

      // Return debug info
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          debug: {
            sheetName: sheet.getName(),
            totalRows: values.length,
            headers: values[0] || [],
            sampleData: values[1] || [],
            allSheets: sheets.map((s) => s.getName()),
          },
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // Handle other actions (registration, etc.)
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unknown action" })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (error) {
    console.error("Error:", error)
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}
