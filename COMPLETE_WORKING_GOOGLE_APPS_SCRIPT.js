// Mock declarations for linting - IGNORE THESE WHEN COPYING TO GOOGLE APPS SCRIPT
var SpreadsheetApp, ContentService

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  console.log("[GAS] doPost called")

  try {
    let data

    // Handle both JSON and FormData
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents)
        console.log("[GAS] Parsed JSON data:", data)
      } catch (jsonError) {
        console.log("[GAS] Not JSON, using parameter data")
        data = e.parameter
      }
    } else {
      data = e.parameter
    }

    console.log("[GAS] Processing action:", data.action)

    switch (data.action) {
      case "submitRegistration":
        return handleRegistration(data)
      case "addVolunteer":
        return handleVolunteer(data)
      case "addExpense":
        return handleExpense(data)
      case "getRegistrations":
        return handleGetRegistrations()
      default:
        console.log("[GAS] Unknown action:", data.action)
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            message: "Unknown action: " + data.action,
          }),
        ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    console.error("[GAS] doPost error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  console.log("[GAS] doGet called")

  try {
    const action = e.parameter.action || "getExpenses"
    console.log("[GAS] GET action:", action)

    switch (action) {
      case "getExpenses":
        return handleGetExpenses()
      case "getRegistrations":
        return handleGetRegistrations()
      default:
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            message: "Unknown GET action: " + action,
          }),
        ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    console.error("[GAS] doGet error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleRegistration(data) {
  console.log("[GAS] Handling registration")

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
      sheet = ss.insertSheet("Registrations")
      sheet
        .getRange(1, 1, 1, 8)
        .setValues([["Timestamp", "Family Name", "Contact Person", "Email", "Phone", "Adults", "Kids", "Total Amount"]])
    }

    const timestamp = new Date()
    const familyName = data.familyName || ""
    const contactPerson = data.contactPerson || ""
    const email = data.email || ""
    const phone = data.phone || ""
    const adults = Number.parseInt(data.adults) || 0
    const kids = Number.parseInt(data.kids) || 0
    const totalAmount = Number.parseFloat(data.totalAmount) || 0

    sheet.appendRow([timestamp, familyName, contactPerson, email, phone, adults, kids, totalAmount])

    console.log("[GAS] Registration added successfully")
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("[GAS] Registration error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleVolunteer(data) {
  console.log("[GAS] Handling volunteer")

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Volunteers")

    if (!sheet) {
      sheet = ss.insertSheet("Volunteers")
      sheet
        .getRange(1, 1, 1, 6)
        .setValues([["Timestamp", "Full Name", "Email", "Phone", "Volunteer Type", "Cleanup Date"]])
    }

    const timestamp = new Date()
    const fullName = data.name || ""
    const email = data.email || ""
    const phone = data.phone || ""
    const volunteerType = data.volunteerType || ""
    const cleanupDate = data.cleanupDate || ""

    sheet.appendRow([timestamp, fullName, email, phone, volunteerType, cleanupDate])

    console.log("[GAS] Volunteer added successfully")
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registration submitted successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("[GAS] Volunteer error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleExpense(data) {
  console.log("[GAS] Handling expense")

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
      sheet = ss.insertSheet("Expenses")
      sheet.getRange(1, 1, 1, 6).setValues([["Timestamp", "Category", "Description", "Amount", "Date", "Receipt"]])
    }

    const timestamp = new Date()
    const category = data.category || ""
    const description = data.description || ""
    const amount = Number.parseFloat(data.amount) || 0
    const expenseDate = data.date || ""
    const receipt = data.receipt || ""

    sheet.appendRow([timestamp, category, description, amount, expenseDate, receipt])

    console.log("[GAS] Expense added successfully")
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense added successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("[GAS] Expense error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleGetRegistrations() {
  console.log("[GAS] Getting registrations")

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("Registrations")

    if (!sheet) {
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
        timestamp: row[0],
        familyName: row[1],
        contactPerson: row[2],
        email: row[3],
        phone: row[4],
        adults: row[5],
        kids: row[6],
        totalAmount: row[7],
      })
    }

    console.log("[GAS] Found", participants.length, "registrations")
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        participants: participants,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("[GAS] Get registrations error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleGetExpenses() {
  console.log("[GAS] Getting expenses")

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("Expenses")

    if (!sheet) {
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
        timestamp: row[0],
        category: row[1],
        description: row[2],
        amount: row[3],
        date: row[4],
        receipt: row[5],
      })
    }

    console.log("[GAS] Found", expenses.length, "expenses")
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        expenses: expenses,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("[GAS] Get expenses error:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Error: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
