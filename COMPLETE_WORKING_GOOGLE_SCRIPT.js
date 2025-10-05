// This script handles registration, participants, expenses, and volunteers

var google = {} // Declare the google variable to fix the lint error
var ContentService = google.script.runtime.ContentService
var SpreadsheetApp = google.script.runtime.SpreadsheetApp

function doPost(e) {
  try {
    const action = e.parameter.action
    console.log("Action received:", action)

    if (action === "getRegistrations") {
      return getRegistrations()
    }

    if (action === "addRegistration") {
      return addRegistration(e)
    }

    if (action === "addExpense") {
      return addExpense(e)
    }

    if (action === "getExpenses") {
      return getExpenses()
    }

    if (action === "addVolunteer") {
      return addVolunteer(e)
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Invalid action: " + action,
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
    let sheet = spreadsheet.getSheetByName("Registration")

    if (!sheet) {
      // Create Registration sheet if it doesn't exist
      sheet = spreadsheet.insertSheet("Registration")
      sheet.getRange(1, 1, 1, 7).setValues([["Name", "Email", "Address", "Mobile", "Adults", "Kids", "Timestamp"]])
    }

    const data = sheet.getDataRange().getValues()
    console.log("Raw sheet data:", data)

    if (data.length <= 1) {
      // Only header row or empty sheet
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          registrations: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const registrations = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[0]) {
        // Only include rows with names
        registrations.push({
          name: row[0] || "",
          email: row[1] || "",
          address: row[2] || "",
          mobile: row[3] || "",
          adults: row[4] || 0,
          kids: row[5] || 0,
          timestamp: row[6] || new Date(),
        })
      }
    }

    console.log("Processed registrations:", registrations)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        registrations: registrations,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in getRegistrations:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to get registrations: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addRegistration(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Registration")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Registration")
      sheet.getRange(1, 1, 1, 7).setValues([["Name", "Email", "Address", "Mobile", "Adults", "Kids", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      e.parameter.fullName || "",
      e.parameter.email || "",
      e.parameter.address || "",
      e.parameter.mobile || "",
      e.parameter.adults || 0,
      e.parameter.kids || 0,
      timestamp,
    ]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration added successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in addRegistration:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to add registration: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addExpense(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 5).setValues([["Description", "Amount", "Category", "Submitted By", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      e.parameter.description || "",
      e.parameter.amount || 0,
      e.parameter.category || "",
      e.parameter.submittedBy || "",
      timestamp,
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
        error: "Failed to add expense: " + error.toString(),
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

    const data = sheet.getDataRange().getValues()

    if (data.length <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const expenses = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[0]) {
        expenses.push({
          description: row[0] || "",
          amount: row[1] || 0,
          category: row[2] || "",
          submittedBy: row[3] || "",
          timestamp: row[4] || new Date(),
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
        error: "Failed to get expenses: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addVolunteer(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Volunteers")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Volunteers")
      sheet
        .getRange(1, 1, 1, 7)
        .setValues([["Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      e.parameter.fullName || "",
      e.parameter.email || "",
      e.parameter.mobile || "",
      e.parameter.volunteerType || "",
      e.parameter.cleanupDate || "",
      e.parameter.submittedBy || "",
      timestamp,
    ]

    sheet.appendRow(rowData)

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
        error: "Failed to add volunteer: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
