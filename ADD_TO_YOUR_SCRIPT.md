# Add This Code to Your Existing Google Apps Script

Your registration works fine, but you need to add this code to handle participant data retrieval.

## Step 1: Add this to your existing `doPost` function

Find your existing `doPost` function and add this case to handle `getRegistrations`:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Your existing registration code here...
    
    // ADD THIS NEW CASE:
    if (action === 'getRegistrations') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Registration sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
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
          name: row[0] || 'Unknown',
          email: row[1] || '',
          mobile: row[2] || '',
          adults: parseInt(row[3]) || 0,
          kids: parseInt(row[4]) || 0,
          timestamp: row[5] || new Date()
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        participants: participants
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Your existing code continues...
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## Step 2: Save and Deploy
1. Save your script (Ctrl+S)
2. Click Deploy → Manage deployments
3. Click the edit icon on your existing deployment
4. Change version to "New version"
5. Click Deploy

That's it! Your participants section will now work.
