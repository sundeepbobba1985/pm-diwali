# Fix Google Apps Script 302 Redirect Error

The 302 redirect error means your Google Apps Script isn't properly deployed for public access. Follow these steps:

## **Step 1: Check Script Deployment**
1. Open your Google Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (pencil) on your deployment
4. Make sure these settings are correct:
   - **Type**: Web app
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (not "Anyone with Google account")
5. Click **Deploy**

## **Step 2: Update Your Script**
Make sure your `doPost` function includes this handler:

\`\`\`javascript
function doPost(e) {
  const action = e.parameter.action;
  
  if (action === 'getRegistrations') {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registration');
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Registration sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const registrations = [];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        registrations.push({
          name: row[0] || 'Unknown',
          email: row[1] || '',
          adults: row[4] || 0,
          kids: row[5] || 0,
          timestamp: row[6] || new Date()
        });
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
  
  // ... rest of your existing doPost function
}
\`\`\`

## **Step 3: Test the Fix**
After redeploying with "Anyone" access, the participants section should work properly.
