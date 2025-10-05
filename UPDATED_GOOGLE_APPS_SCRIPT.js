// Mock declarations for linter - DO NOT COPY THESE TO GOOGLE APPS SCRIPT
const SpreadsheetApp = {}
const ContentService = {}

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  try {
    console.log("Received POST request")
    const data = JSON.parse(e.postData.contents)
    console.log("Parsed data:", data)

    switch (data.action) {
      case "addVolunteer":
        return handleVolunteer(data)
      case "submitRegistration":
        return handleRegistration(data)
      case "addExpense":
        return handleExpense(data)
      case "getRegistrations":
        return handleGetRegistrations()
      default:
        console.log("Unknown action:", data.action)
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            error: "Unknown action: " + data.action,
          }),
        ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    console.error("Error in doPost:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleVolunteer(data) {
  try {
    console.log("Processing volunteer data:", data)

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Volunteers")

    if (!sheet) {
      console.log("Creating Volunteers sheet")
      sheet = ss.insertSheet("Volunteers")
      sheet.getRange(1, 1, 1, 5).setValues([["Timestamp", "Full Name", "Email", "Volunteer Type", "Cleanup Date"]])
    }

    const timestamp = new Date()
    const rowData = [timestamp, data.name || "", data.email || "", data.volunteerType || "", data.cleanupDate || ""]

    sheet.appendRow(rowData)
    console.log("Volunteer data added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registered successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleVolunteer:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleRegistration(data) {
  // Placeholder for handleRegistration function
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: "handleRegistration function not implemented",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

function handleExpense(data) {
  // Placeholder for handleExpense function
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: "handleExpense function not implemented",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

function handleGetRegistrations() {
  // Placeholder for handleGetRegistrations function
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      error: "handleGetRegistrations function not implemented",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}
