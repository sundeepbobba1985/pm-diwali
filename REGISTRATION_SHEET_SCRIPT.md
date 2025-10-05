# Google Apps Script for Registration Sheet

Replace your entire Google Apps Script with this code:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'addRegistration') {
      // Handle registration submission
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration');
      if (!sheet) {
        // Create Registration sheet if it doesn't exist
        const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Registration');
        newSheet.getRange(1, 1, 1, 7).setValues([['Timestamp', 'Full Name', 'Email', 'Mobile', 'Adults', 'Kids', 'Zelle Confirmation']]);
        sheet = newSheet;
      }
      
      sheet.appendRow([
        new Date(),
        data.fullName,
        data.email,
        data.mobile,
        data.adults,
        data.kids,
        data.zelleConfirmation
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration submitted successfully'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'getRegistrations') {
      // Handle getting registration data
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          registrations: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const registrations = [];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        registrations.push({
          timestamp: row[0],
          name: row[1] || 'Unknown',
          email: row[2] || '',
          mobile: row[3] || '',
          adults: row[4] || 0,
          kids: row[5] || 0,
          zelleConfirmation: row[6] || ''
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        registrations: registrations
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'addExpense') {
      // Handle expense submission
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Expenses');
        sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Description', 'Amount', 'Category', 'Submitted By']]);
      }
      
      sheet.appendRow([
        new Date(),
        data.description,
        data.amount,
        data.category,
        data.submittedBy
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Expense submitted successfully'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'getExpenses') {
      // Handle getting expense data
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Expenses');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          expenses: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const expenses = [];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        expenses.push({
          timestamp: row[0],
          description: row[1],
          amount: row[2],
          category: row[3],
          submittedBy: row[4]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        expenses: expenses
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (action === 'addVolunteer') {
      // Handle volunteer submission
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Volunteers');
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Volunteers');
        sheet.getRange(1, 1, 1, 7).setValues([['Timestamp', 'Full Name', 'Email', 'Mobile', 'Volunteer Type', 'Clean-up Date', 'Submitted By']]);
      }
      
      sheet.appendRow([
        new Date(),
        data.fullName,
        data.email,
        data.mobile,
        data.volunteerType,
        data.cleanupDate || '',
        data.submittedBy
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Volunteer registration submitted successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## Instructions:
1. Go to your Google Apps Script
2. Replace the entire script with the code above
3. Save (Ctrl+S)
4. Deploy → Manage deployments → Edit → New version → Deploy
5. The script will automatically create a "Registration" sheet if it doesn't exist
