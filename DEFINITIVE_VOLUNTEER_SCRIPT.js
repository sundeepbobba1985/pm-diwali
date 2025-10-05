// Mock declarations for linting - REMOVE THESE LINES when copying to Google Apps Script
const SpreadsheetApp = {}
const ContentService = {}

// COPY FROM HERE - Complete Google Apps Script for Volunteers and Registrations

function doPost(e) {
  try {
    console.log("Received POST request:", e.postData.contents)

    const data = JSON.parse(e.postData.contents)
    const action = data.action

    console.log("Action:", action)
    console.log("Data:", data)

    if (action === "addVolunteer") {
      return handleVolunteer(data)
    } else if (action === "submitRegistration") {
      return handleRegistration(data)
    } else if (action === "getRegistrations") {
      return getRegistrations()
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
  try {
    console.log("Handling volunteer submission:", data)

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let volunteersSheet = spreadsheet.getSheetByName("Volunteers")

    // Create Volunteers sheet if it doesn't exist
    if (!volunteersSheet) {
      console.log("Creating Volunteers sheet...")
      volunteersSheet = spreadsheet.insertSheet("Volunteers")

      // Add headers
      const headers = ["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By"]
      volunteersSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      console.log("Volunteers sheet created with headers")
    }

    // Prepare volunteer data
    const timestamp = new Date()
    const volunteerData = [
      timestamp,
      data.fullName || "",
      data.email || "",
      data.mobile || "",
      data.volunteerType || "",
      data.cleanupDate || "",
      data.submittedBy || "",
    ]

    console.log("Adding volunteer data:", volunteerData)

    // Add data to sheet
    const lastRow = volunteersSheet.getLastRow()
    volunteersSheet.getRange(lastRow + 1, 1, 1, volunteerData.length).setValues([volunteerData])

    console.log("Volunteer data added successfully to row:", lastRow + 1)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Volunteer registered successfully",
        sheet: "Volunteers",
        row: lastRow + 1,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error handling volunteer:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to register volunteer: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function handleRegistration(data) {
  try {
    console.log("Handling registration submission:", data)

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let registrationsSheet = spreadsheet.getSheetByName("Registrations")

    // Create Registrations sheet if it doesn't exist
    if (!registrationsSheet) {
      console.log("Creating Registrations sheet...")
      registrationsSheet = spreadsheet.insertSheet("Registrations")

      // Add headers
      const headers = [
        "Timestamp",
        "Family Name",
        "Contact Person",
        "Email",
        "Mobile",
        "Address",
        "Adults",
        "Kids",
        "Confirmation Number",
      ]
      registrationsSheet.getRange(1, 1, 1, headers.length).setValues([headers])
      console.log("Registrations sheet created with headers")
    }

    // Prepare registration data
    const timestamp = new Date()
    const registrationData = [
      timestamp,
      data.familyName || "",
      data.contactPerson || "",
      data.email || "",
      data.mobile || "",
      data.address || "",
      data.adults || 0,
      data.kids || 0,
      data.confirmationNumber || "",
    ]

    console.log("Adding registration data:", registrationData)

    // Add data to sheet
    const lastRow = registrationsSheet.getLastRow()
    registrationsSheet.getRange(lastRow + 1, 1, 1, registrationData.length).setValues([registrationData])

    console.log("Registration data added successfully to row:", lastRow + 1)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Registration submitted successfully",
        sheet: "Registrations",
        row: lastRow + 1,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error handling registration:", error)
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Failed to submit registration: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function getRegistrations() {
  try {
    console.log("Getting registrations...")

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const registrationsSheet = spreadsheet.getSheetByName("Registrations")

    if (!registrationsSheet) {
      console.log("Registrations sheet not found")
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          participants: [],
          message: "No registrations sheet found",
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
      participants.push({
        familyName: row[1] || "",
        contactPerson: row[2] || "",
        email: row[3] || "",
        mobile: row[4] || "",
        address: row[5] || "",
        adults: row[6] || 0,
        kids: row[7] || 0,
        confirmationNumber: row[8] || "",
      })
    }

    console.log("Returning", participants.length, "participants")

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
        error: "Failed to get registrations: " + error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}
