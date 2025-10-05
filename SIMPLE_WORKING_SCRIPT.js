// Simple Google Apps Script that actually works
// Copy this entire code to your Google Apps Script editor
// Note: The declarations below are only for linting - remove them when copying to Google Apps Script

/* eslint-disable */
// Mock declarations for linting (remove when copying to Google Apps Script)
const ContentService = typeof ContentService !== "undefined" ? ContentService : {}
const SpreadsheetApp = typeof SpreadsheetApp !== "undefined" ? SpreadsheetApp : {}
/* eslint-enable */

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  try {
    const action = e.parameter.action || e.postData?.contents ? JSON.parse(e.postData.contents).action : null

    if (action === "getRegistrations") {
      // Get the active spreadsheet
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

      // Get the "Registrations" sheet specifically
      const sheet = spreadsheet.getSheetByName("Registrations")

      if (!sheet) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Registrations sheet not found",
          }),
        ).setMimeType(ContentService.MimeType.JSON)
      }

      // Get all data from the sheet
      const data = sheet.getDataRange().getValues()

      if (data.length <= 1) {
        return ContentService.createTextOutput(
          JSON.stringify({
            success: true,
            participants: [],
            message: "No data found in Registrations sheet",
          }),
        ).setMimeType(ContentService.MimeType.JSON)
      }

      // Skip header row and process data
      const participants = []
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (row[0]) {
          // If first column has data
          participants.push({
            id: i,
            familyName: row[1] || "Unknown Family",
            contactName: row[2] || "Unknown Contact",
            email: row[3] || "",
            mobile: row[4] || "",
            adults: Number.parseInt(row[5]) || 0,
            kids: Number.parseInt(row[6]) || 0,
            timestamp: row[0] || new Date().toISOString(),
          })
        }
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: participants,
          totalFound: participants.length,
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // Handle registration submission (existing functionality)
    if (action === "submitRegistration" || !action) {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
      let sheet = spreadsheet.getSheetByName("Registrations")

      if (!sheet) {
        sheet = spreadsheet.insertSheet("Registrations")
        sheet
          .getRange(1, 1, 1, 7)
          .setValues([["Timestamp", "Family Name", "Contact Name", "Email", "Mobile", "Adults", "Kids"]])
      }

      const data = e.parameter
      sheet.appendRow([
        new Date(),
        data.familyName || "",
        data.contactName || "",
        data.email || "",
        data.mobile || "",
        data.adults || 0,
        data.kids || 0,
      ])

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: "Registration submitted successfully",
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Unknown action: " + action,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
