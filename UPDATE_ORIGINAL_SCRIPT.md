# Update Your Original Google Apps Script

Your original Google Apps Script (ending in ...LA/exec) only handles registration submission. You need to add the participant retrieval functionality.

## Steps:

1. **Open your original Google Apps Script** (the one ending in ...LA/exec)
2. **Replace the entire code** with this updated version:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Received data: ' + JSON.stringify(data));
    
    if (data.action === 'addRegistration') {
      return addRegistration(data);
    } else if (data.action === 'addExpense') {
      return addExpense(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unknown action: ' + data.action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    Logger.log('GET request with action: ' + action);
    
    if (action === 'getParticipants') {
      return getParticipants();
    } else if (action === 'getExpenses') {
      return getExpenses();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unknown action: ' + action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addRegistration(data) {
  const sheet = getOrCreateSheet('Registrations');
  
  // Add headers if this is the first row
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([
      ['Timestamp', 'Name', 'Email', 'Address', 'Mobile', 'Adults', 'Kids', 'Signed In']
    ]);
  }
  
  const timestamp = new Date().toLocaleString();
  sheet.appendRow([
    timestamp,
    data.name || '',
    data.email || '',
    data.address || '',
    data.mobile || '',
    data.adults || 0,
    data.kids || 0,
    data.signedIn ? 'Yes' : 'No'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Registration added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getParticipants() {
  const sheet = getOrCreateSheet('Registrations');
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      participants: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const participants = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    participants.push({
      name: row[1] || 'Unknown',
      adults: row[5] || 0,
      kids: row[6] || 0,
      timestamp: row[0] || ''
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    participants: participants
  })).setMimeType(ContentService.MimeType.JSON);
}

function addExpense(data) {
  const sheet = getOrCreateSheet('Expenses');
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([
      ['Timestamp', 'Category', 'Description', 'Amount', 'Receipt', 'Added By']
    ]);
  }
  
  const timestamp = new Date().toLocaleString();
  sheet.appendRow([
    timestamp,
    data.category || '',
    data.description || '',
    data.amount || 0,
    data.receipt || '',
    data.addedBy || ''
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Expense added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getExpenses() {
  const sheet = getOrCreateSheet('Expenses');
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      expenses: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const expenses = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    expenses.push({
      timestamp: row[0] || '',
      category: row[1] || '',
      description: row[2] || '',
      amount: parseFloat(row[3]) || 0,
      receipt: row[4] || '',
      addedBy: row[5] || ''
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    expenses: expenses
  })).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  
  return sheet;
}
\`\`\`

3. **Save the script**
4. **Deploy it again**:
   - Click Deploy > Manage deployments
   - Click the edit icon (pencil)
   - Change version to "New version"
   - Click Deploy

This will add the missing `getParticipants` function to your original script.
