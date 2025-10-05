// Mock declarations for linting - REMOVE THESE LINES when copying to Google Apps Script
// ContentService and SpreadsheetApp are automatically available in Google Apps Script environment
const ContentService = {}
const SpreadsheetApp = {}

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  try {
    console.log("Received POST request:", e.parameter)

    const action = e.parameter.action

    if (action === "addRegistration") {
      return handleRegistration(e.parameter)
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
    } else if (action === "addExpense") {
      return handleExpense(e.parameter)
    } else if (action === "getExpenses") {
      return handleGetExpenses()
    } else if (action === "addVolunteer") {
      return handleVolunteer(e.parameter)
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Invalid action: " + action,
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

function handleRegistration(params) {
  try {
    const sheet = getOrCreateSheet("Registrations")

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Full Name", "Email", "Mobile", "Address", "Adults", "Kids", "Zelle Confirmation", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      params.fullName || "",
      params.email || "",
      params.mobile || "",
      params.address || "",
      Number.parseInt(params.adults) || 0,
      Number.parseInt(params.kids) || 0,
      params.zelleConfirmation || "",
      timestamp,
    ]

    sheet.appendRow(rowData)

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

function handleGetRegistrations() {
  try {
    const sheet = getOrCreateSheet("Registrations")

    if (sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = sheet.getDataRange().getValues()
    const participants = []

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      participants.push({
        name: row[0] || "Unknown",
        email: row[1] || "",
        mobile: row[2] || "",
        address: row[3] || "",
        adults: Number.parseInt(row[4]) || 0,
        kids: Number.parseInt(row[5]) || 0,
        zelleConfirmation: row[6] || "",
        timestamp: row[7] || new Date(),
      })
    }

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

function handleExpense(params) {
  try {
    const sheet = getOrCreateSheet("Expenses")

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([["Description", "Amount", "Category", "Submitted By", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      params.description || "",
      Number.parseFloat(params.amount) || 0,
      params.category || "",
      params.submittedBy || "",
      timestamp,
    ]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense submitted successfully",
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

function handleGetExpenses() {
  try {
    const sheet = getOrCreateSheet("Expenses")

    if (sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          expenses: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = sheet.getDataRange().getValues()
    const expenses = []

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      expenses.push({
        description: row[0] || "",
        amount: Number.parseFloat(row[1]) || 0,
        category: row[2] || "",
        submittedBy: row[3] || "",
        timestamp: row[4] || new Date(),
      })
    }

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

function handleVolunteer(params) {
  try {
    const sheet = getOrCreateSheet("Volunteers")

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet
        .getRange(1, 1, 1, 7)
        .setValues([["Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By", "Timestamp"]])
    }

    const timestamp = new Date()
    const rowData = [
      params.fullName || "",
      params.email || "",
      params.mobile || "",
      params.volunteerType || "",
      params.cleanupDate || "",
      params.submittedBy || "",
      timestamp,
    ]

    sheet.appendRow(rowData)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration submitted successfully",
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

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(sheetName)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName)
  }

  return sheet
}
