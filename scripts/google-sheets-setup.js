// ===================================================================
// GOOGLE APPS SCRIPT CODE - NOT FOR NODE.JS EXECUTION
// ===================================================================
//
// INSTRUCTIONS:
// 1. Open Google Sheets and create a new spreadsheet
// 2. Go to Extensions > Apps Script
// 3. Delete the default code and paste this entire function
// 4. Save the project
// 5. Deploy as Web App (Execute as: Me, Access: Anyone)
// 6. Copy the web app URL and add it as GOOGLE_SHEETS_URL environment variable
//
// This code uses Google Apps Script built-in APIs:
// - SpreadsheetApp: Built-in Google Sheets API
// - ContentService: Built-in HTTP response API
// ===================================================================

function doPost(e) {
  try {
    // Get the active sheet (SpreadsheetApp is a built-in Google Apps Script API)
    const sheet = SpreadsheetApp.getActiveSheet()
    const data = JSON.parse(e.postData.contents)

    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Full Name", "Email", "Address", "Mobile", "Adults", "Kids", "Signed In"]])
    }

    // Add the registration data
    sheet.appendRow([
      data.timestamp,
      data.fullName,
      data.email,
      data.address,
      data.mobile,
      data.adults,
      data.kids,
      data.signedInUser,
    ])

    // Return success response (ContentService is a built-in Google Apps Script API)
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

// Optional: Test function to verify the script works
function testFunction() {
  Logger.log("Google Apps Script is working correctly!")
}
