# Google Apps Script Deployment Instructions

## Step 1: Replace Your Script
1. Go to your Google Apps Script editor
2. **DELETE ALL EXISTING CODE**
3. Copy and paste the complete script from `COMPLETE_GOOGLE_APPS_SCRIPT.js`
4. Click **Save** (Ctrl+S)

## Step 2: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Type" and select **Web app**
3. Set the following:
   - **Description**: "Ganesh Chaturthi Event Management"
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (CRITICAL - must be "Anyone")
4. Click **Deploy**
5. **IMPORTANT**: Copy the new web app URL and provide it to update the website

## Step 3: Test the Script
- The script will automatically create sheets: Registration, Expenses, Volunteers
- Test by submitting a registration through your website
- Check if the data appears in the Registration sheet

## Troubleshooting
- If you get 302 redirects, ensure "Who has access" is set to "Anyone"
- If you get permission errors, authorize the script when prompted
- Make sure to use the NEW web app URL after deployment

## Critical Note
The 302 error you're experiencing is because your current script deployment doesn't have "Anyone" access. This complete script with proper deployment settings will fix the issue.
