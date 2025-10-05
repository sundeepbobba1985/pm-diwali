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

function doGet(e) {
  try {
    const action = e.parameter.action || "getRegistrations"
    console.log("GET request action:", action)

    switch (action) {
      case "getRegistrations":
        return handleGetRegistrations()
      case "getExpenses":
        return handleGetExpenses()
      default:
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
  try {
    console.log("Processing registration data:", data)

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
      console.log("Creating Registrations sheet")
      sheet = ss.insertSheet("Registrations")
      sheet
        .getRange(1, 1, 1, 9)
        .setValues([
          [
            "Timestamp",
            "Family Name",
            "Contact Person",
            "Email",
            "Phone",
            "Address",
            "Adults",
            "Kids",
            "Zelle Confirmation",
          ],
        ])
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

    sheet.appendRow(rowData)
    console.log("Registration data added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleRegistration:", error)
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
    console.log("Processing expense data:", data)

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
      console.log("Creating Expenses sheet")
      sheet = ss.insertSheet("Expenses")
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Category", "Description", "Amount", "Date", "Paid By", "Receipt", "Submitted By"]])
    }

    const timestamp = new Date()
    const rowData = [
      timestamp,
      data.category || "",
      data.description || "",
      data.amount || 0,
      data.date || "",
      data.paidBy || "",
      data.receipt || "",
      data.submittedBy || "",
    ]

    sheet.appendRow(rowData)
    console.log("Expense data added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense recorded successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleExpense:", error)
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
    console.log("Getting registrations data")

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
      console.log("Registrations sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = sheet.getDataRange().getValues()
    const headers = data[0]
    const participants = []

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      const participant = {}

      for (let j = 0; j < headers.length; j++) {
        participant[headers[j]] = row[j]
      }

      participants.push(participant)
    }

    console.log("Found", participants.length, "participants")

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
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleGetExpenses() {
  try {
    console.log("Getting expenses data")

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
      console.log("Expenses sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = sheet.getDataRange().getValues()
    const headers = data[0]
    const expenses = []

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      const expense = {}

      for (let j = 0; j < headers.length; j++) {
        expense[headers[j]] = row[j]
      }

      expenses.push(expense)
    }

    console.log("Found", expenses.length, "expenses")

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
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
