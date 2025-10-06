# Google Sheets Integration Setup

Follow these steps to connect your registration and volunteer forms to Google Sheets:

## Step 1: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Diwali 2025 Registrations"
3. Create two sheets within this spreadsheet:
   - **Sheet 1: "Registrations"** - for family registrations
   - **Sheet 2: "Volunteers"** - for volunteer sign-ups

### Registrations Sheet Headers (Sheet 1)
In the first row, add these column headers:
- A1: `Timestamp`
- B1: `Full Name`
- C1: `Email`
- D1: `Address`
- E1: `Mobile`
- F1: `Adults`
- G1: `Kids`
- H1: `Zelle Confirmation`

### Volunteers Sheet Headers (Sheet 2)
In the first row, add these column headers:
- A1: `Timestamp`
- B1: `Name`
- C1: `Email`
- D1: `Volunteer Activity`
- E1: `Preferred Date`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

\`\`\`javascript
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const registrationSheet = ss.getSheetByName("Registrations");
    const data = registrationSheet.getDataRange().getValues();
    
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
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // Check if this is a volunteer registration or family registration
    if (data.type === "volunteer") {
      const volunteerSheet = ss.getSheetByName("Volunteers");
      
      // Add row with volunteer data
      volunteerSheet.appendRow([
        data.timestamp,
        data.name,
        data.email,
        data.volunteerType,
        data.cleanupDate || "Not specified"
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Volunteer registration added successfully"
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      // Family registration
      const registrationSheet = ss.getSheetByName("Registrations");
      
      // Add row with registration data
      registrationSheet.appendRow([
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
    }
    
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
   - Description: "Diwali Registration & Volunteer Webhook"
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

The Google Apps Script now supports:
- **POST requests for registrations**: Add new family registrations to the "Registrations" sheet
- **POST requests for volunteers**: Add new volunteer sign-ups to the "Volunteers" sheet
- **GET requests**: Retrieve statistics (total families, adults, kids) from the "Registrations" sheet

The homepage automatically fetches and displays registration statistics every 30 seconds, showing visitors how many people have already registered.

## Testing

After setup:
1. **Family Registration**: Data will be sent to the "Registrations" sheet
2. **Volunteer Sign-up**: Data will be sent to the "Volunteers" sheet
3. Both forms also save data to localStorage as backup
4. You can view all data in your Google Sheet in real-time
5. The homepage displays live registration statistics

## Troubleshooting

- If data isn't appearing, check the Apps Script execution logs
- Make sure the Web app is deployed with "Anyone" access
- Verify the webhook URL is correctly added to Vercel environment variables
- Ensure both sheets ("Registrations" and "Volunteers") exist with correct names
- If statistics aren't updating, test the GET endpoint by visiting the webhook URL in your browser
