# Simple Google Apps Script Update

Your current Google Apps Script only needs this small addition to work with participants:

## Add this to your existing doPost function:

\`\`\`javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  // Your existing registration code...
  if (action === 'addRegistration') {
    // ... existing registration code ...
  }
  
  // ADD THIS NEW SECTION:
  if (action === 'getRegistrations') {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const registrations = [];
      
      // Skip header row, start from row 1
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) { // Only include rows with data
          registrations.push({
            name: row[0] || 'Unknown',
            email: row[1] || '',
            mobile: row[2] || '',
            address: row[3] || '',
            adults: row[4] || 0,
            kids: row[5] || 0,
            timestamp: row[6] || new Date()
          });
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        registrations: registrations
      })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Your existing expense code...
}
\`\`\`

## Steps:
1. Open your Google Apps Script
2. Add the `getRegistrations` section to your existing `doPost` function
3. Save and redeploy with "New version"
