// ===== MOCK DECLARATIONS FOR LINTING ONLY =====
// These are automatically available in Google Apps Script runtime
// DO NOT copy these declarations to Google Apps Script editor
var SpreadsheetApp = {
  getActiveSpreadsheet: () => {},
  newTextOutput: () => {},
  MimeType: { JSON: "application/json" },
}
var console = { log: () => {}, error: () => {} }
var ContentService = {
  createTextOutput: () => {},
  MimeType: { JSON: "application/json" },
}
// ===== END MOCK DECLARATIONS =====

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  try {
    console.log("Received request:", e.postData.contents)

    const data = JSON.parse(e.postData.contents)
    const action = data.action

    console.log("Action:", action)

    if (action === "getRegistrations") {
      return getRegistrations()
    } else if (action === "addRegistration") {
      return addRegistration(data)
    } else if (action === "addExpense") {
      return addExpense(data)
    } else if (action === "getExpenses") {
      return getExpenses()
    } else if (action === "addVolunteer") {
      return addVolunteer(data)
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

    let sheet = spreadsheet.getSheetByName("Registration")
    if (!sheet) {
      sheet = spreadsheet.getSheetByName("Registrations")
    }
    if (!sheet) {
      sheet = spreadsheet.getSheetByName("Sheet1")
    }
    if (!sheet) {
      // Get the first sheet if none of the expected names exist
      sheet = spreadsheet.getSheets()[0]
    }

    console.log("Using sheet:", sheet.getName())

    const range = sheet.getDataRange()
    const values = range.getValues()

    console.log("Total rows found:", values.length)
    console.log("First few rows:", values.slice(0, 3))

    if (values.length <= 1) {
      console.log("No data rows found (only headers or empty sheet)")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const participants = []

    for (let i = 1; i < values.length; i++) {
      const row = values[i]

      const participant = {
        name: row[0] || "Unknown",
        email: row[1] || "",
        mobile: row[2] || "",
        address: row[3] || "",
        adults: Number.parseInt(row[4]) || 0,
        kids: Number.parseInt(row[5]) || 0,
        timestamp: row[6] || new Date(),
        zelleConfirmation: row[7] || "",
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
    console.error("Error in getRegistrations:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addRegistration(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Registration")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Registration")
      // Add headers
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Name", "Email", "Mobile", "Address", "Adults", "Kids", "Timestamp", "Zelle Confirmation"]])
    }

    const newRow = [
      data.name || "",
      data.email || "",
      data.mobile || "",
      data.address || "",
      data.adults || 0,
      data.kids || 0,
      new Date(),
      data.zelleConfirmation || "",
    ]

    sheet.appendRow(newRow)

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
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function addExpense(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Expenses")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 5).setValues([["Timestamp", "Description", "Amount", "Category", "Submitted By"]])
    }

    const newRow = [new Date(), data.description || "", data.amount || 0, data.category || "", data.submittedBy || ""]

    sheet.appendRow(newRow)

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

    const range = sheet.getDataRange()
    const values = range.getValues()

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
      expenses.push({
        timestamp: row[0],
        description: row[1],
        amount: row[2],
        category: row[3],
        submittedBy: row[4],
      })
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

function addVolunteer(data) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName("Volunteers")

    if (!sheet) {
      sheet = spreadsheet.insertSheet("Volunteers")
      sheet
        .getRange(1, 1, 1, 7)
        .setValues([["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By"]])
    }

    const newRow = [
      new Date(),
      data.fullName || "",
      data.email || "",
      data.mobile || "",
      data.volunteerType || "",
      data.cleanupDate || "",
      data.submittedBy || "",
    ]

    sheet.appendRow(newRow)

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
