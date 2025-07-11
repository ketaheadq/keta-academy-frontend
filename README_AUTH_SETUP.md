# Authentication Setup Guide

## Strapi Google OAuth Configuration

To enable Google authentication, you need to configure both Google OAuth and Strapi:

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs to: `http://localhost:1337/api/connect/google/callback`

### 2. Strapi Configuration

1. In your Strapi admin panel, go to **Settings** → **Providers**
2. Find **Google** provider and click **Edit**
3. Fill in the configuration:
   - **Enable**: ✅ Yes
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **The redirect URL to your front-end app**: `http://localhost:3000/auth/callback`
   - **The redirect URL to add in your Google application configurations**: `http://localhost:1337/api/connect/google/callback`

### 3. Environment Variables

Create a `.env.local` file in your Next.js project:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 4. Testing the Flow

1. User clicks "Google Sign In" button
2. Redirects to: `http://localhost:1337/api/connect/google`
3. Google OAuth flow completes
4. Google redirects to: `http://localhost:1337/api/connect/google/callback`
5. Strapi processes OAuth and redirects to: `http://localhost:3000/auth/callback?jwt=...`
6. Your app processes the JWT and logs the user in

## Important Notes

- The **redirect URL to your front-end app** in Strapi settings should be: `http://localhost:3000/auth/callback`
- The **redirect URL for Google** should be: `http://localhost:1337/api/connect/google/callback`
- Strapi handles the OAuth flow and sends the JWT to your frontend
- No additional OAuth libraries needed in Next.js!

## Production Setup

For production, update the URLs:
- Google OAuth redirect: `https://your-strapi-domain.com/api/connect/google/callback`
- Strapi front-end redirect: `https://your-nextjs-domain.com/auth/callback` 