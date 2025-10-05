// Mock declarations for linting (ignore when copying to Google Apps Script)
var SpreadsheetApp = {}
var ContentService = {}

// COPY FROM HERE - Complete Google Apps Script for Registration Data
function doPost(e) {
  try {
    console.log("doPost called with parameters:", e.parameter)

    var action = e.parameter.action
    console.log("Action received:", action)

    if (action === "addRegistration") {
      return handleRegistration(e.parameter)
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
    } else if (action === "addExpense") {
      return handleExpense(e.parameter)
    } else if (action === "addVolunteer") {
      return handleVolunteer(e.parameter)
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Unknown action: " + action,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
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

function handleGetRegistrations() {
  try {
    console.log("Getting registrations from Registrations sheet...")

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Registrations")

    if (!sheet) {
      console.log("Registrations sheet not found, trying other sheet names...")
      var sheets = spreadsheet.getSheets()
      for (var j = 0; j < sheets.length; j++) {
        console.log("Available sheet:", sheets[j].getName())
        if (sheets[j].getName().toLowerCase().includes("regist")) {
          sheet = sheets[j]
          console.log("Using sheet:", sheet.getName())
          break
        }
      }
    }

    if (!sheet) {
      console.log("No registration sheet found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var data = sheet.getDataRange().getValues()
    console.log("Sheet data rows:", data.length)

    if (data.length <= 1) {
      console.log("No data found in sheet (only headers or empty)")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var headers = data[0]
    console.log("Headers found:", headers)

    var participants = []

    // Process each row (skip header row)
    for (var k = 1; k < data.length; k++) {
      var row = data[k]

      // Skip empty rows
      if (!row[0] || row[0].toString().trim() === "") {
        continue
      }

      // Create participant object from row data
      var participant = {
        timestamp: row[0] || "",
        familyName: row[1] || "",
        contactPerson: row[2] || "",
        email: row[3] || "",
        mobile: row[4] || "",
        adults: Number.parseInt(row[5]) || 0,
        kids: Number.parseInt(row[6]) || 0,
        address: row[7] || "",
        confirmationNumber: row[8] || "",
      }

      participants.push(participant)
    }

    console.log("Participants found:", participants.length)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        participants: participants,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error getting registrations:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleRegistration(params) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Registrations")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Registrations")
      // Add headers
      sheet
        .getRange(1, 1, 1, 9)
        .setValues([
          [
            "Timestamp",
            "Family Name",
            "Contact Person",
            "Email",
            "Mobile",
            "Adults",
            "Kids",
            "Address",
            "Confirmation Number",
          ],
        ])
    }

    var timestamp = new Date()
    var row = [
      timestamp,
      params.familyName || "",
      params.contactPerson || "",
      params.email || "",
      params.mobile || "",
      Number.parseInt(params.adults) || 0,
      Number.parseInt(params.kids) || 0,
      params.address || "",
      params.confirmationNumber || "",
    ]

    sheet.appendRow(row)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration added successfully",
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

function handleExpense(params) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 4).setValues([["Timestamp", "Description", "Amount", "Submitted By"]])
    }

    var timestamp = new Date()
    var row = [timestamp, params.description, Number.parseFloat(params.amount), params.submittedBy]
    sheet.appendRow(row)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense added successfully",
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

function handleVolunteer(params) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Volunteers")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Volunteers")
      sheet
        .getRange(1, 1, 1, 7)
        .setValues([["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By"]])
    }

    var timestamp = new Date()
    var row = [
      timestamp,
      params.fullName,
      params.email,
      params.mobile,
      params.volunteerType,
      params.cleanupDate,
      params.submittedBy,
    ]
    sheet.appendRow(row)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration added successfully",
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
