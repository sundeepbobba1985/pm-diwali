# Google OAuth Setup Instructions

To enable real Google Sign-In authentication, follow these steps:

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google` (for development)
   - `https://your-production-domain.vercel.app/api/auth/google` (for production)
   - `https://*.vercel.app/api/auth/google` (for Vercel preview deployments)

## 2. Environment Variables

Add these environment variables to your Vercel project:

\`\`\`env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_SITE_URL=https://your-production-domain.vercel.app
\`\`\`

## 3. Fix Current Error

Your current error shows the redirect URI: `https://pm-ganesh-jio4lfyyr-sundeepbobba-gmailcoms-projects.vercel.app/api/auth/google`

**To fix this immediately:**
1. Go to your Google Cloud Console OAuth credentials
2. Add this exact URL to your Authorized redirect URIs:
   - `https://pm-ganesh-jio4lfyyr-sundeepbobba-gmailcoms-projects.vercel.app/api/auth/google`
3. Also add the wildcard pattern for future Vercel previews:
   - `https://*.vercel.app/api/auth/google`

## 4. Testing

- Development: OAuth will redirect to `http://localhost:3000/api/auth/google`
- Production: OAuth will redirect to your Vercel domain + `/api/auth/google`
- Preview: OAuth will work with any Vercel preview URL

The authentication will now prompt users for real Google credentials and store their actual name and email address.
