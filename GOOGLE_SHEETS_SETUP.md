# Google Sheets Integration Setup

## Step 1: Create Google Apps Script

1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Ganesh Chaturthi 2025 Registrations"
3. Go to **Extensions > Apps Script**
4. Delete the default `myFunction()` code
5. Paste the following code:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action
    
    if (action === 'addVolunteer') {
      // Handle volunteer data
      const volunteerSheet = getOrCreateSheet('Volunteers')
      
      // Add headers if this is the first row
      if (volunteerSheet.getLastRow() === 0) {
        volunteerSheet
          .getRange(1, 1, 1, 7)
          .setValues([["Timestamp", "Full Name", "Email", "Mobile", "Volunteer Type", "Clean-up Date", "Submitted By"]])
      }
      
      // Add the volunteer data
      volunteerSheet.appendRow([
        data.timestamp,
        data.fullName,
        data.email,
        data.mobile,
        data.volunteerType,
        data.cleanupDate || '',
        data.submittedBy,
      ])
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: "Volunteer registration submitted successfully" }))
        .setMimeType(ContentService.MimeType.JSON)
        
    } else if (action === 'addExpense') {
      // Handle expense data
      const expenseSheet = getOrCreateSheet('Expenses')
      
      // Add headers if this is the first row
      if (expenseSheet.getLastRow() === 0) {
        expenseSheet
          .getRange(1, 1, 1, 8)
          .setValues([["Timestamp", "Category", "Description", "Amount", "Date", "Paid By", "Receipt", "Submitted By"]])
      }
      
      // Add the expense data
      expenseSheet.appendRow([
        data.data.timestamp,
        data.data.category,
        data.data.description,
        data.data.amount,
        data.data.date,
        data.data.paidBy,
        data.data.receipt,
        data.data.submittedBy,
      ])
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: "Expense added successfully" }))
        .setMimeType(ContentService.MimeType.JSON)
    } else {
      // Handle registration data (existing code)
      const registrationSheet = getOrCreateSheet('Registrations')
      
      // Add headers if this is the first row
      if (registrationSheet.getLastRow() === 0) {
        registrationSheet
          .getRange(1, 1, 1, 9)
          .setValues([["Timestamp", "Full Name", "Email", "Address", "Mobile", "Adults", "Kids", "Zelle Confirmation", "Signed In"]])
      }

      // Add the registration data
      registrationSheet.appendRow([
        data.timestamp,
        data.fullName,
        data.email,
        data.address,
        data.mobile,
        data.adults,
        data.kids,
        data.zelleConfirmation,
        data.signedInUser,
      ])

      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON)
    }
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action
    
    if (action === 'getParticipants') {
      const registrationSheet = getOrCreateSheet('Registrations')
      const data = registrationSheet.getDataRange().getValues()
      
      // Skip header row and extract participant data
      const participants = data.slice(1).map(row => ({
        name: row[1], // Full Name
        adults: parseInt(row[5]) || 0, // Adults
        kids: parseInt(row[6]) || 0, // Kids
        timestamp: row[0] // Timestamp
      }))
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, participants: participants }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    if (action === 'getExpenses') {
      const expenseSheet = getOrCreateSheet('Expenses')
      const data = expenseSheet.getDataRange().getValues()
      
      // Skip header row and extract expense data
      const expenses = data.slice(1).map(row => ({
        timestamp: row[0],
        category: row[1],
        description: row[2],
        amount: parseFloat(row[3]) || 0,
        date: row[4],
        paidBy: row[5],
        receipt: row[6],
        submittedBy: row[7]
      }))
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, expenses: expenses }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Default response for unknown actions
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Helper function to create or get sheets
function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(sheetName)
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName)
  }
  
  return sheet
}
\`\`\`

## Step 2: Deploy as Web App

1. Click **Deploy > New deployment**
2. Choose **Web app** as the type
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** (it will look like: `https://script.google.com/macros/s/...../exec`)

## Step 3: Add Environment Variable

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `GOOGLE_SHEETS_URL`
   - **Value**: The Web App URL you copied in Step 2
4. Redeploy your application

## Step 4: Test the Integration

Once deployed, test the registration, volunteer, and expense forms on your website. Successful submissions will appear as new rows in separate sheets:
- **Registrations** sheet: Event registrations with Zelle confirmation
- **Volunteers** sheet: Volunteer signups with contact details and preferences
- **Expenses** sheet: Event expenses and financial tracking

## Troubleshooting

- Make sure the Google Apps Script is deployed with "Anyone" access
- Verify the environment variable is set correctly in Vercel
- Check the Google Apps Script execution logs if data isn't appearing
- The script will automatically create separate sheets for Registrations, Volunteers, and Expenses
