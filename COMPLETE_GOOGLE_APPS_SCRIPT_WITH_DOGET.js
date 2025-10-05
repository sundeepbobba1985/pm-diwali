// Mock declarations for linting - IGNORE THESE WHEN COPYING TO GOOGLE APPS SCRIPT
var SpreadsheetApp, ContentService, Logger

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doGet(e) {
  try {
    Logger.log("doGet called with parameters: " + JSON.stringify(e.parameters))

    const action = e.parameter.action
    Logger.log("Action requested: " + action)

    if (action === "getExpenses") {
      return handleGetExpenses()
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
    } else {
      Logger.log("Unknown action in doGet: " + action)
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Unknown action: " + action,
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    Logger.log("Error in doGet: " + error.toString())
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doPost(e) {
  try {
    Logger.log("doPost called")
    Logger.log("Request body: " + e.postData.contents)

    const data = JSON.parse(e.postData.contents)
    Logger.log("Parsed data: " + JSON.stringify(data))

    const action = data.action
    Logger.log("Action: " + action)

    if (action === "submitRegistration") {
      return handleRegistration(data)
    } else if (action === "addVolunteer") {
      return handleVolunteer(data)
    } else if (action === "addExpense") {
      return handleExpense(data)
    } else {
      Logger.log("Unknown action: " + action)
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Unknown action: " + action,
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString())
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
    Logger.log("Getting expenses data...")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
      Logger.log("Expenses sheet not found, creating it...")
      sheet = ss.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 6).setValues([["Date", "Description", "Amount", "Category", "Receipt", "Submitted By"]])
    }

    const data = sheet.getDataRange().getValues()
    Logger.log("Raw expenses data: " + JSON.stringify(data))

    if (data.length <= 1) {
      Logger.log("No expenses data found")
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
      if (row[0] && row[1]) {
        // Only include rows with date and description
        expenses.push({
          date: row[0],
          description: row[1],
          amount: row[2] || 0,
          category: row[3] || "",
          receipt: row[4] || "",
          submittedBy: row[5] || "",
        })
      }
    }

    Logger.log("Processed expenses: " + JSON.stringify(expenses))

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        expenses: expenses,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error getting expenses: " + error.toString())
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
    Logger.log("Getting registrations data...")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
      Logger.log("Registrations sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const data = sheet.getDataRange().getValues()
    Logger.log("Raw registrations data: " + JSON.stringify(data))

    if (data.length <= 1) {
      Logger.log("No registrations data found")
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
        // Only include rows with family name (column B)
        participants.push({
          familyName: row[1] || "", // Column B: Full Name
          contactPerson: row[2] || "", // Column C: Email
          email: row[3] || "", // Column D: Address
          phone: row[4] || "", // Column E: Mobile
          address: row[5] || "", // Column F: Adults
          adults: Number.parseInt(row[5]) || 0, // Column F: Adults
          kids: Number.parseInt(row[6]) || 0, // Column G: Kids
          timestamp: row[0] || new Date(), // Column A: Timestamp
          zelleConfirmation: row[8] || "", // Column I: Zelle Confirmation
        })
      }
    }

    Logger.log("Processed participants: " + JSON.stringify(participants))

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        participants: participants,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error getting registrations: " + error.toString())
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
    Logger.log("Handling registration...")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
      Logger.log("Creating Registrations sheet...")
      sheet = ss.insertSheet("Registrations")
      sheet
        .getRange(1, 1, 1, 9)
        .setValues([
          [
            "Timestamp",
            "Full Name",
            "Email",
            "Address",
            "Mobile",
            "Adults",
            "Kids",
            "Dietary Restrictions",
            "Zelle Confirmation",
          ],
        ])
    }

    const newRow = [
      new Date(),
      data.familyName || "",
      data.contactPerson || "",
      data.email || "",
      data.phone || "",
      data.adults || 0,
      data.kids || 0,
      data.dietaryRestrictions || "",
      data.zelleConfirmation || "",
    ]

    sheet.appendRow(newRow)
    Logger.log("Registration added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error handling registration: " + error.toString())
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
    Logger.log("Handling volunteer registration...")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Volunteers")

    if (!sheet) {
      Logger.log("Creating Volunteers sheet...")
      sheet = ss.insertSheet("Volunteers")
      sheet.getRange(1, 1, 1, 6).setValues([["Name", "Email", "Phone", "Volunteer Type", "Cleanup Date", "Timestamp"]])
    }

    const newRow = [
      data.name || "",
      data.email || "",
      data.phone || "",
      data.volunteerType || "",
      data.cleanupDate || "",
      new Date(),
    ]

    sheet.appendRow(newRow)
    Logger.log("Volunteer registration added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error handling volunteer: " + error.toString())
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
    Logger.log("Handling expense submission...")
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
      Logger.log("Creating Expenses sheet...")
      sheet = ss.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 6).setValues([["Date", "Description", "Amount", "Category", "Receipt", "Submitted By"]])
    }

    const newRow = [
      data.date || new Date(),
      data.description || "",
      data.amount || 0,
      data.category || "",
      data.receipt || "",
      data.submittedBy || "",
    ]

    sheet.appendRow(newRow)
    Logger.log("Expense added successfully")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error handling expense: " + error.toString())
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
