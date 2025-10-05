// Mock declarations for linting - IGNORE THESE IN GOOGLE APPS SCRIPT
const SpreadsheetApp = {}
const ContentService = {}

// ===== COPY FROM HERE TO GOOGLE APPS SCRIPT =====

function doPost(e) {
  console.log("doPost called with:", e.postData.contents)

  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action

    console.log("Action received:", action)
    console.log("Data received:", data)

    if (action === "addVolunteer") {
      return handleVolunteer(data)
    } else if (action === "submitRegistration") {
      return handleRegistration(data)
    } else if (action === "getRegistrations") {
      return handleGetRegistrations()
    } else if (action === "addExpense") {
      return handleExpense(data)
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

function doGet(e) {
  console.log("doGet called with:", e.parameter)

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

function handleExpense(requestData) {
  console.log("handleExpense called with:", requestData)

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let expensesSheet = spreadsheet.getSheetByName("Expenses")

    // Create Expenses sheet if it doesn't exist
    if (!expensesSheet) {
      console.log("Creating new Expenses sheet")
      expensesSheet = spreadsheet.insertSheet("Expenses")

      // Add headers to match the expected format
      const headers = ["Timestamp", "Category", "Description", "Amount", "Date", "Paid By", "Receipt", "Submitted By"]
      expensesSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      expensesSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
      console.log("Expenses sheet created with headers")
    }

    // Extract data from nested structure
    const expenseData = requestData.data || requestData

    // Add expense data
    const timestamp = new Date()
    const rowData = [
      timestamp,
      expenseData.category || "",
      expenseData.description || "",
      expenseData.amount || 0,
      expenseData.date || "",
      expenseData.paidBy || "",
      expenseData.receipt || "",
      expenseData.submittedBy || "",
    ]

    console.log("Adding expense data:", rowData)
    expensesSheet.appendRow(rowData)

    console.log("Expense successfully added to sheet")

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Expense recorded successfully",
        timestamp: timestamp.toISOString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error in handleExpense:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to add expense: " + error.toString(),
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

    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[1]) {
        // Check if category exists
        expenses.push({
          timestamp: row[0] || "",
          category: row[1] || "",
          description: row[2] || "",
          amount: Number.parseFloat(row[3]) || 0,
          date: row[4] || "",
          paidBy: row[5] || "",
          receipt: row[6] || "",
          submittedBy: row[7] || "",
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

function handleVolunteer(data) {
  console.log("handleVolunteer called with:", data)

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let volunteersSheet = spreadsheet.getSheetByName("Volunteers")

    // Create Volunteers sheet if it doesn't exist
    if (!volunteersSheet) {
      console.log("Creating new Volunteers sheet")
      volunteersSheet = spreadsheet.insertSheet("Volunteers")

      const headers = ["Timestamp", "Full Name", "Email", "Volunteer Type", "Cleanup Date"]
      volunteersSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      volunteersSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
      console.log("Volunteers sheet created with headers")
    }

    // Add volunteer data
    const timestamp = new Date()
    const rowData = [timestamp, data.name || "", data.email || "", data.volunteerType || "", data.cleanupDate || ""]

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

    // Create Registrations sheet if it doesn't exist
    if (!registrationsSheet) {
      console.log("Creating new Registrations sheet")
      registrationsSheet = spreadsheet.insertSheet("Registrations")

      const headers = [
        "Timestamp",
        "Full Name",
        "Email",
        "Address",
        "Mobile",
        "Adults",
        "Kids",
        "Signed In",
        "Zelle Confirmation",
      ]
      registrationsSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      registrationsSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold")
      console.log("Registrations sheet created with headers")
    }

    const timestamp = new Date()
    const rowData = [
      timestamp,
      data.familyName || "", // Full Name
      data.email || "", // Email
      data.address || "", // Address
      data.phone || "", // Mobile
      data.adults || 0, // Adults
      data.kids || 0, // Kids
      data.signedInUser || "", // Signed In
      data.zelleConfirmation || "", // Added Zelle Confirmation data
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

    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[1]) {
        // Check if family name exists
        participants.push({
          familyName: row[1] || "",
          contactPerson: row[2] || "",
          email: row[3] || "",
          phone: row[4] || "",
          address: row[5] || "",
          adults: Number.parseInt(row[6]) || 0,
          kids: Number.parseInt(row[7]) || 0,
          timestamp: row[0] || "",
          zelleConfirmation: row[8] || "", // Added Zelle Confirmation data
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
