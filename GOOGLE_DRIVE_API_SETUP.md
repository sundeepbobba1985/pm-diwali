# Google Drive API Setup Instructions

To enable automatic image loading from your Google Drive folder, you need to set up Google Drive API access.

## Step 1: Enable Google Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (or create a new one)
3. Go to **APIs & Services** → **Library**
4. Search for "Google Drive API" and click on it
5. Click **"Enable"**

## Step 2: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the generated API key
4. Click **"Restrict Key"** for security
5. Under **"API restrictions"**, select **"Restrict key"**
6. Choose **"Google Drive API"** from the list
7. Under **"Website restrictions"**, add your domains:
   - `http://localhost:3000/*` (for development)
   - `https://your-vercel-domain.vercel.app/*` (for production)
8. Click **"Save"**

## Step 3: Make Google Drive Folder Public

1. Go to your Google Drive folder
2. Right-click → **"Share"**
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"** (not Editor for security)
5. Click **"Done"**

## Step 4: Add Environment Variable

Add this environment variable to your Vercel project:
- `GOOGLE_DRIVE_API_KEY` = Your API key from Step 2

## How It Works

The gallery will now automatically:
- Fetch images from your Google Drive folder
- Display them in chronological order (newest first)
- Use the filename as the image caption
- Fall back to sample images if the API fails

Users can still upload images to your Google Drive folder, and they'll automatically appear in the gallery within a few minutes.
