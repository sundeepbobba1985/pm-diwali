// Mock declarations for linting - REMOVE THESE LINES when copying to Google Apps Script
var SpreadsheetApp = {}
var ContentService = {}

// COPY FROM HERE - Complete Google Apps Script for PV Ganesha Event Management

function doPost(e) {
  try {
    console.log("doPost called with:", e.postData.contents)

    var data = JSON.parse(e.postData.contents)
    var action = data.action

    console.log("Action:", action)

    if (action === "submitRegistration") {
      return handleRegistration(data)
    } else if (action === "getRegistrations") {
      return getRegistrations()
    } else if (action === "submitExpense") {
      return handleExpense(data)
    } else if (action === "getExpenses") {
      return getExpenses()
    } else if (action === "submitVolunteer") {
      return handleVolunteer(data)
    } else {
      console.log("Unknown action:", action)
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Unknown action: " + action,
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

function getRegistrations() {
  try {
    console.log("Getting registrations from Registrations sheet...")

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Registrations")

    if (!sheet) {
      console.log("Registrations sheet not found, trying to create it...")
      sheet = spreadsheet.insertSheet("Registrations")
      // Add headers
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Family Name", "Primary Contact", "Email", "Mobile", "Adults", "Kids", "Address"]])
      console.log("Created Registrations sheet with headers")

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var data = sheet.getDataRange().getValues()
    console.log("Raw data from sheet:", data.length, "rows")

    if (data.length <= 1) {
      console.log("No data found (only headers or empty sheet)")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var participants = []
    var headers = data[0]
    console.log("Headers:", headers)

    // Process each row (skip header row)
    for (var i = 1; i < data.length; i++) {
      var row = data[i]

      // Skip empty rows
      if (!row[1] || row[1].toString().trim() === "") {
        continue
      }

      var participant = {
        timestamp: row[0] ? row[0].toString() : "",
        familyName: row[1] ? row[1].toString() : "",
        primaryContact: row[2] ? row[2].toString() : "",
        email: row[3] ? row[3].toString() : "",
        mobile: row[4] ? row[4].toString() : "",
        adults: row[5] ? Number.parseInt(row[5]) || 0 : 0,
        kids: row[6] ? Number.parseInt(row[6]) || 0 : 0,
        address: row[7] ? row[7].toString() : "",
      }

      participants.push(participant)
    }

    console.log("Processed participants:", participants.length)

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

function handleRegistration(data) {
  try {
    console.log("Handling registration:", data)

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Registrations")

    if (!sheet) {
      console.log("Creating Registrations sheet...")
      sheet = spreadsheet.insertSheet("Registrations")
      // Add headers
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Family Name", "Primary Contact", "Email", "Mobile", "Adults", "Kids", "Address"]])
    }

    var timestamp = new Date()
    var rowData = [
      timestamp,
      data.familyName || "",
      data.primaryContact || "",
      data.email || "",
      data.mobile || "",
      Number.parseInt(data.adults) || 0,
      Number.parseInt(data.kids) || 0,
      data.address || "",
    ]

    sheet.appendRow(rowData)
    console.log("Registration added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error handling registration:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleExpense(data) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 4).setValues([["Timestamp", "Description", "Amount", "Submitted By"]])
    }

    var timestamp = new Date()
    var rowData = [timestamp, data.description || "", Number.parseFloat(data.amount) || 0, data.submittedBy || ""]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense submitted successfully",
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

function getExpenses() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var data = sheet.getDataRange().getValues()

    if (data.length <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    var expenses = []
    for (var i = 1; i < data.length; i++) {
      var row = data[i]
      if (row[1]) {
        expenses.push({
          timestamp: row[0] ? row[0].toString() : "",
          description: row[1] ? row[1].toString() : "",
          amount: row[2] ? Number.parseFloat(row[2]) || 0 : 0,
          submittedBy: row[3] ? row[3].toString() : "",
        })
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        expenses: expenses,
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

function handleVolunteer(data) {
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
    var rowData = [
      timestamp,
      data.fullName || "",
      data.email || "",
      data.mobile || "",
      data.volunteerType || "",
      data.cleanupDate || "",
      data.submittedBy || "",
    ]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration submitted successfully",
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
