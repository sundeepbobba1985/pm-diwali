/* eslint-disable no-unused-vars */
const ContentService = {}
const SpreadsheetApp = {}
/* eslint-enable no-unused-vars */

function doPost(e) {
  console.log("doPost called")
  console.log("postData contents:", e.postData.contents)
  console.log("parameters:", e.parameter)

  try {
    let data
    let action

    if (e.parameter && e.parameter.action) {
      // FormData submission (from volunteer form)
      data = e.parameter
      action = data.action
      console.log("Processing FormData submission")
    } else if (e.postData && e.postData.contents) {
      // JSON submission (from registration form)
      data = JSON.parse(e.postData.contents)
      action = data.action
      console.log("Processing JSON submission")
    } else {
      throw new Error("No valid data received")
    }

    console.log("Action received:", action)
    console.log("Data received:", data)

    if (action === "addVolunteer") {
      return handleVolunteer(data)
    } else if (action === "submitRegistration") {
      return handleRegistration(data)
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
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

function handleVolunteer(data) {
  console.log("handleVolunteer called with:", data)

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let volunteersSheet = spreadsheet.getSheetByName("Volunteers")

    // Create Volunteers sheet if it doesn't exist
    if (!volunteersSheet) {
      console.log("Creating new Volunteers sheet")
      volunteersSheet = spreadsheet.insertSheet("Volunteers")

      // Add headers
      const headers = ["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date"]
      volunteersSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      volunteersSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
      console.log("Volunteers sheet created with headers")
    }

    // Add volunteer data
    const timestamp = new Date()
    const rowData = [
      timestamp,
      data.name || "",
      data.email || "",
      data.phone || "",
      data.volunteerType || "",
      data.cleanupDate || "",
    ]

    console.log("Adding volunteer data:", rowData)
    volunteersSheet.appendRow(rowData)

    console.log("Volunteer successfully added to sheet")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registered successfully",
        timestamp: timestamp.toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleVolunteer:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to add volunteer: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleRegistration(data) {
  console.log("handleRegistration called with:", data)

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let registrationsSheet = spreadsheet.getSheetByName("Registrations")

    if (!registrationsSheet) {
      console.log("Creating new Registrations sheet")
      registrationsSheet = spreadsheet.insertSheet("Registrations")

      const headers = [
        "Timestamp",
        "Family Name",
        "Contact Person",
        "Email",
        "Phone",
        "Address",
        "Adults",
        "Kids",
        "Zelle Confirmation",
      ]
      registrationsSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      registrationsSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
      console.log("Registrations sheet created with headers")
    }

    const timestamp = new Date()
    const rowData = [
      timestamp,
      data.familyName || "",
      data.contactPerson || "",
      data.email || "",
      data.phone || "",
      data.address || "",
      data.adults || 0,
      data.kids || 0,
      data.zelleConfirmation || "",
    ]

    console.log("Adding registration data:", rowData)
    registrationsSheet.appendRow(rowData)

    console.log("Registration successfully added to sheet")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
        timestamp: timestamp.toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleRegistration:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to add registration: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleGetRegistrations() {
  console.log("handleGetRegistrations called")

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const registrationsSheet = spreadsheet.getSheetByName("Registrations")

    if (!registrationsSheet) {
      console.log("Registrations sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = registrationsSheet.getDataRange().getValues()
    console.log("Found", data.length, "rows in Registrations sheet")

    if (data.length <= 1) {
      console.log("No registration data found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const participants = []

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[1]) {
        participants.push({
          familyName: row[1] || "",
          contactPerson: row[2] || "",
          email: row[3] || "",
          phone: row[4] || "",
          address: row[5] || "",
          adults: Number.parseInt(row[6]) || 0,
          kids: Number.parseInt(row[7]) || 0,
          timestamp: row[0] || "",
        })
      }
    }

    console.log("Returning", participants.length, "participants")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        participants: participants,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleGetRegistrations:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to get registrations: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  console.log("doGet called with parameters:", e.parameter)

  try {
    const action = e.parameter.action

    if (action === "getExpenses") {
      return handleGetExpenses()
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Unknown GET action: " + action,
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    console.error("Error in doGet:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleGetExpenses() {
  console.log("handleGetExpenses called")

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const expensesSheet = spreadsheet.getSheetByName("Expenses")

    if (!expensesSheet) {
      console.log("Expenses sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = expensesSheet.getDataRange().getValues()
    console.log("Found", data.length, "rows in Expenses sheet")

    if (data.length <= 1) {
      console.log("No expense data found")
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
      if (row[1]) {
        expenses.push({
          timestamp: row[0] || "",
          description: row[1] || "",
          amount: Number.parseFloat(row[2]) || 0,
          category: row[3] || "",
          submittedBy: row[4] || "",
        })
      }
    }

    console.log("Returning", expenses.length, "expenses")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        expenses: expenses,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleGetExpenses:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to get expenses: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
