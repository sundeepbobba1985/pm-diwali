# Google Sheets Integration Setup

Follow these steps to connect your registration form to Google Sheets:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Diwali 2025 Registrations"
3. In the first row, add these column headers:
   - A1: `Timestamp`
   - B1: `Full Name`
   - C1: `Email`
   - D1: `Address`
   - E1: `Mobile`
   - F1: `Adults`
   - G1: `Kids`
   - H1: `Zelle Confirmation`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

\`\`\`javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and calculate totals
    let totalFamilies = data.length - 1; // Subtract header row
    let totalAdults = 0;
    let totalKids = 0;
    
    // Loop through rows (skip header at index 0)
    for (let i = 1; i < data.length; i++) {
      totalAdults += Number(data[i][5]) || 0; // Column F (Adults)
      totalKids += Number(data[i][6]) || 0;   // Column G (Kids)
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      totalFamilies: totalFamilies,
      totalAdults: totalAdults,
      totalKids: totalKids
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      totalFamilies: 0,
      totalAdults: 0,
      totalKids: 0,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add row with registration data
    sheet.appendRow([
      data.timestamp,
      data.fullName,
      data.email,
      data.address,
      data.mobile,
      data.adults,
      data.kids,
      data.zelleConfirmation
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Registration added successfully"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

3. Click **Save** (disk icon)
4. Click **Deploy** → **New deployment**
5. Click the gear icon next to "Select type" and choose **Web app**
6. Configure:
   - Description: "Diwali Registration Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Click **Authorize access** and grant permissions
9. **Copy the Web app URL** - you'll need this for the next step

## Step 3: Add Environment Variable to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **pm-diwali** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - Name: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: (paste the Web app URL you copied)
5. Click **Save**
6. Redeploy your project

## How It Works

The Google Apps Script now supports both:
- **POST requests**: Add new registrations to the sheet
- **GET requests**: Retrieve statistics (total families, adults, kids)

The homepage automatically fetches and displays these statistics every 30 seconds, showing visitors how many people have already registered.

## Testing

After setup, when someone submits the registration form:
1. Data will be sent to your Google Sheet automatically
2. Data will also be saved to localStorage as backup
3. You can view all registrations in your Google Sheet in real-time
4. The homepage will display live registration statistics

## Troubleshooting

- If registrations aren't appearing, check the Apps Script execution logs
- Make sure the Web app is deployed with "Anyone" access
- Verify the webhook URL is correctly added to Vercel environment variables
- If statistics aren't updating, test the GET endpoint by visiting the webhook URL in your browser
