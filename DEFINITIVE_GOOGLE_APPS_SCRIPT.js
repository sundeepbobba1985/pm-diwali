// Mock declarations for linting - REMOVE THESE LINES when copying to Google Apps Script
const SpreadsheetApp = {}
const ContentService = {}

// COPY FROM HERE - Complete Google Apps Script for Ganesh Chaturthi Registration System

function doPost(e) {
  try {
    const action = e.parameter.action
    console.log("Action received:", action)

    if (action === "getRegistrations") {
      return getRegistrations()
    } else if (action === "addRegistration") {
      return addRegistration(e.parameter)
    } else if (action === "addExpense") {
      return addExpense(e.parameter)
    } else if (action === "getExpenses") {
      return getExpenses()
    } else if (action === "addVolunteer") {
      return addVolunteer(e.parameter)
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

function getRegistrations() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    console.log("Spreadsheet opened successfully")

    // Try to get the "Registrations" sheet specifically
    let sheet = spreadsheet.getSheetByName("Registrations")
    if (!sheet) {
      console.log("Registrations sheet not found, trying alternatives...")
      // Try other possible names
      sheet =
        spreadsheet.getSheetByName("Registration") || spreadsheet.getSheetByName("Sheet1") || spreadsheet.getSheets()[0]
    }

    if (!sheet) {
      throw new Error("No sheet found")
    }

    console.log("Using sheet:", sheet.getName())

    // Get all data from the sheet
    const dataRange = sheet.getDataRange()
    const values = dataRange.getValues()

    console.log("Total rows found:", values.length)
    console.log("First few rows:", JSON.stringify(values.slice(0, 3)))

    if (values.length <= 1) {
      console.log("No data rows found (only headers or empty)")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // Get headers from first row
    const headers = values[0]
    console.log("Headers found:", JSON.stringify(headers))

    // Process data rows (skip header row)
    const participants = []
    for (let i = 1; i < values.length; i++) {
      const row = values[i]

      // Skip empty rows
      if (row.every((cell) => !cell || cell.toString().trim() === "")) {
        continue
      }

      // Create participant object from row data
      const participant = {
        id: i,
        timestamp: row[0] || "",
        familyName: row[1] || "",
        contactPerson: row[2] || "",
        email: row[3] || "",
        mobile: row[4] || "",
        address: row[5] || "",
        adults: Number.parseInt(row[6]) || 0,
        kids: Number.parseInt(row[7]) || 0,
        totalMembers: (Number.parseInt(row[6]) || 0) + (Number.parseInt(row[7]) || 0),
        paymentConfirmation: row[8] || "",
        submittedBy: row[9] || "",
      }

      participants.push(participant)
    }

    console.log("Participants processed:", participants.length)
    console.log("Sample participant:", JSON.stringify(participants[0]))

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        participants: participants,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in getRegistrations:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addRegistration(params) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Registrations")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Registrations")
      // Add headers
      sheet
        .getRange(1, 1, 1, 10)
        .setValues([
          [
            "Timestamp",
            "Family Name",
            "Contact Person",
            "Email",
            "Mobile",
            "Address",
            "Adults",
            "Kids",
            "Payment Confirmation",
            "Submitted By",
          ],
        ])
    }

    const timestamp = new Date().toLocaleString()
    const rowData = [
      timestamp,
      params.familyName || "",
      params.contactPerson || "",
      params.email || "",
      params.mobile || "",
      params.address || "",
      params.adults || 0,
      params.kids || 0,
      params.paymentConfirmation || "",
      params.submittedBy || "",
    ]

    sheet.appendRow(rowData)

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

function addExpense(params) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 5).setValues([["Timestamp", "Description", "Amount", "Category", "Submitted By"]])
    }

    const timestamp = new Date().toLocaleString()
    const rowData = [
      timestamp,
      params.description || "",
      Number.parseFloat(params.amount) || 0,
      params.category || "",
      params.submittedBy || "",
    ]

    sheet.appendRow(rowData)

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

function getExpenses() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const values = sheet.getDataRange().getValues()
    if (values.length <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const expenses = []
    for (let i = 1; i < values.length; i++) {
      const row = values[i]
      if (row.some((cell) => cell && cell.toString().trim() !== "")) {
        expenses.push({
          id: i,
          timestamp: row[0] || "",
          description: row[1] || "",
          amount: Number.parseFloat(row[2]) || 0,
          category: row[3] || "",
          submittedBy: row[4] || "",
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

function addVolunteer(params) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Volunteers")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Volunteers")
      sheet
        .getRange(1, 1, 1, 7)
        .setValues([["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By"]])
    }

    const timestamp = new Date().toLocaleString()
    const rowData = [
      timestamp,
      params.fullName || "",
      params.email || "",
      params.mobile || "",
      params.volunteerType || "",
      params.cleanupDate || "",
      params.submittedBy || "",
    ]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration successful",
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
