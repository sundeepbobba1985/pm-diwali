# Fixed Google Apps Script Code

Replace your entire Google Apps Script with this corrected version:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addRegistration') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      sheet.appendRow([
        data.name,
        data.email,
        data.address,
        data.mobile,
        data.adults,
        data.kids,
        new Date()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration added successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getParticipants') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const participants = [];
      
      // Skip header row if it exists
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) { // Only add rows with names
          participants.push({
            name: row[0],
            email: row[1] || '',
            adults: row[4] || 0,
            kids: row[5] || 0,
            timestamp: row[6] || new Date()
          });
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        participants: participants
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

## Steps to Fix:
1. **Delete all existing code** in your Google Apps Script
2. **Paste this complete code** above
3. **Save** (Ctrl+S)
4. **Deploy** → **Manage deployments** → Edit → **New version** → **Deploy**

This version uses "Sheet1" (the default sheet name) and has better error handling.
