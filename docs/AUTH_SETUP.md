# Authentication Setup Guide

## Custom Google OAuth Implementation

This application uses a **custom Google OAuth implementation** that bypasses Strapi's built-in provider and **redirects to the frontend with authentication data**.

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** (or People API)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs to: `http://localhost:1337/api/auth/google/callback`

**Important:** The custom implementation uses `/api/auth/google/callback` as the callback endpoint.

### 2. Strapi Backend Configuration

Your Strapi backend should have the custom authentication controller implemented with these endpoints:
- `GET /api/auth/google` - Initiates OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback and redirects to frontend
- `GET /api/auth/me` - Test endpoint for JWT validation

### 3. Environment Variables

**Development Frontend (.env.local):**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Production Frontend (.env.production):**
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.com
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.com
```

**Backend (.env in Strapi):**
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:1337/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### 4. Authentication Flow

1. User clicks "Google Sign In" button on frontend
2. Redirects to: `http://localhost:1337/api/auth/google`
3. Your custom controller redirects to Google OAuth
4. Google OAuth flow completes
5. Google redirects to: `http://localhost:1337/api/auth/google/callback`
6. **Your custom controller processes OAuth and redirects to frontend with URL parameters:**
   ```
   http://localhost:3000/auth/callback?token=JWT_TOKEN&user=USER_DATA&success=true
   ```
7. Frontend processes the URL parameters and logs the user in

### 5. URL Parameters from Backend

#### **Success Callback:**
```
http://localhost:3000/auth/callback?token=JWT_TOKEN&user=USER_DATA&success=true
```

**Parameters:**
- `token`: JWT token for API authentication
- `user`: JSON-encoded user data from Strapi
- `success`: "true" for successful authentication

#### **Error Callback:**
```
http://localhost:3000/auth/callback?error=ERROR_TYPE&message=ERROR_MESSAGE&success=false
```

**Parameters:**
- `error`: Error type (e.g., "authentication_failed")
- `message`: Human-readable error message
- `success`: "false" for failed authentication

### 6. Frontend Auth Callback Handler

The auth callback page (`/auth/callback`) automatically:

1. **Extracts URL parameters** (token, user, success, error, message)
2. **Validates authentication success** by checking `success=true`
3. **Parses user data** from the `user` parameter
4. **Stores JWT token** for API calls
5. **Handles errors** if authentication failed
6. **Redirects user** to dashboard or login page accordingly

### 7. Key Differences from Built-in Provider

✅ **Benefits of Custom Implementation:**
- More reliable than Strapi's built-in Google provider
- **Frontend-friendly**: Redirects back to your app with data
- **No API calls needed**: User data included in callback
- Better error handling and debugging
- Automatic user creation on first login
- Full control over the authentication flow
- Detailed logging for troubleshooting

❌ **What Changed:**
- Uses `/api/auth/google` instead of `/api/connect/google`
- Callback URL is `/api/auth/google/callback` instead of `/api/connect/google/callback`
- **Backend redirects to frontend with URL parameters**
- **No need to fetch user data separately** - it's in the URL
- No need to configure providers in Strapi admin panel
- Environment variables are set in Strapi backend, not admin panel

### 8. Google Cloud Console Configuration

**Authorized JavaScript Origins:**
```
http://localhost:1337
http://localhost:3000
```

**Authorized Redirect URIs:**
```
http://localhost:1337/api/auth/google/callback
```

### 9. Testing the Implementation

1. Start your Strapi backend with the custom auth controller
2. Start the frontend: `npm run dev`
3. Navigate to: `http://localhost:3000/giris`
4. Click "Google ile Devam Et"
5. Complete Google OAuth
6. **You should be redirected to:**
   ```
   http://localhost:3000/auth/callback?token=eyJhbG...&user=%7B%22id%22...&success=true
   ```
7. Check browser console for authentication logs

### 10. Expected Console Output

**Frontend Console:**
```
🔍 Custom Google OAuth URL: http://localhost:1337/api/auth/google
🔍 Auth redirect parameters: {token: "eyJhbG...", user: "{\"id\":1,...}", success: "true"}
✅ JWT token received from URL parameters
✅ User data parsed from URL parameter: {id: 1, username: "user_123", email: "user@gmail.com"}
```

**Backend Console (Strapi):**
```
🔍 Debug Info: GOOGLE_CLIENT_ID: SET, GOOGLE_CLIENT_SECRET: SET
👤 Google User: {id: '123', email: 'user@gmail.com', name: 'User Name'}
✅ Found existing user: user@gmail.com
🎉 Authentication successful for: user@gmail.com
🔗 Redirecting to frontend: http://localhost:3000/auth/callback?token=eyJhbG...&user=%7B%22id%22...&success=true
```

### 11. Troubleshooting

**Common Issues:**

1. **redirect_uri_mismatch**
   - Ensure Google Console has: `http://localhost:1337/api/auth/google/callback`
   - Check GOOGLE_REDIRECT_URI in backend .env

2. **No token in callback URL**
   - Check backend logs for authentication errors
   - Verify Google Client ID/Secret are correct
   - Ensure `FRONTEND_URL` is set in backend .env

3. **User data parsing failed**
   - The `user` parameter is JSON-encoded
   - Frontend automatically handles decoding
   - Check browser console for parse errors

4. **success=false in callback**
   - Check `error` and `message` parameters for details
   - Backend encountered an issue during OAuth processing

### 12. Production Setup

For production, update the URLs:

**Backend .env:**
```env
GOOGLE_REDIRECT_URI=https://your-strapi-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-nextjs-domain.com
```

**Frontend .env.local:**
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
NEXT_PUBLIC_FRONTEND_URL=https://your-nextjs-domain.com
```

**Google Cloud Console:**
- Authorized JavaScript Origins: `https://your-strapi-domain.com`, `https://your-nextjs-domain.com`
- Authorized Redirect URIs: `https://your-strapi-domain.com/api/auth/google/callback`

## Success Criteria

Your custom implementation is working when you see:

✅ Console logs showing custom OAuth URLs
✅ Successful redirect to Google
✅ **Callback URL contains token, user data, and success=true**
✅ User data automatically parsed from URL
✅ Authentication working in frontend without additional API calls
✅ User created/updated in Strapi database

## Architecture Benefits

This implementation provides a **seamless frontend experience**:

- 🚀 **No loading states** - User data is immediately available
- 🔒 **Secure** - JWT token generated server-side
- 📱 **Mobile-friendly** - Works with any frontend framework
- 🐛 **Easy debugging** - All data visible in URL parameters
- ⚡ **Fast** - No additional API calls needed after callback
