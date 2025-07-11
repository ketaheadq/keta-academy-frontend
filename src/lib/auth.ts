// Strapi authentication utilities

export interface StrapiUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface AuthError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

// Get Google OAuth URL from Strapi
export function getGoogleAuthUrl(): string {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  // Debug: Log the URL being used
  console.log('🔍 Strapi URL:', strapiUrl);
  console.log('🔍 Full Google OAuth URL:', `${strapiUrl}/api/connect/google`);
  
  // Strapi's Google OAuth endpoint - redirect URL is configured in Strapi admin panel
  return `${strapiUrl}/api/connect/google`;
}

// Debug function to help identify the redirect URI issue
export function debugGoogleOAuthConfig() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const expectedRedirectUri = `${strapiUrl}/api/connect/google/callback`;
  
  console.log('🔍 Expected Google redirect URI should be:', expectedRedirectUri);
  console.log('🔍 Make sure this EXACT URL is in your Google Cloud Console');
  console.log('🔍 Also check Strapi admin panel Settings → Providers → Google');
  
  return {
    strapiUrl,
    expectedRedirectUri,
    googleOAuthUrl: `${strapiUrl}/api/connect/google`
  };
}

// Handle auth result when user is redirected back from Strapi
export async function handleAuthRedirect(searchParams: URLSearchParams): Promise<StrapiAuthResponse | AuthError> {
  try {
    // Debug: Log all parameters received
    console.log('🔍 Auth redirect parameters:', Object.fromEntries(searchParams.entries()));
    
    // Strapi typically redirects with these parameters after successful OAuth
    const jwt = searchParams.get('jwt') || searchParams.get('access_token');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('❌ OAuth error from URL:', error);
      return {
        error: {
          status: 400,
          name: 'OAuthError', 
          message: error || 'OAuth authentication failed'
        }
      };
    }
    
    if (!jwt) {
      console.error('❌ No JWT token found in callback URL');
      return {
        error: {
          status: 400,
          name: 'AuthError',
          message: 'No authentication token received'
        }
      };
    }

    console.log('✅ JWT token received, fetching user info...');

    // Get user info with the JWT token
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const response = await fetch(`${strapiUrl}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Failed to get user info:', errorData);
      return { 
        error: { 
          status: response.status, 
          name: 'AuthError', 
          message: 'Failed to get user info',
          details: errorData
        } 
      };
    }

    const user = await response.json();
    console.log('✅ User info received:', user);
    
    return {
      jwt,
      user
    };
  } catch (error) {
    console.error('❌ Auth redirect error:', error);
    return {
      error: {
        status: 500,
        name: 'NetworkError',
        message: 'Network error during authentication'
      }
    };
  }
}

// Keep the old function for backward compatibility, but use the new one
export async function handleStrapiAuthCallback(jwt: string): Promise<StrapiAuthResponse | AuthError> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    // Get user info with the JWT token
    const response = await fetch(`${strapiUrl}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: { 
          status: response.status, 
          name: 'AuthError', 
          message: 'Failed to get user info',
          details: errorData
        } 
      };
    }

    const user = await response.json();
    
    return {
      jwt,
      user
    };
  } catch (error) {
    console.error('Strapi auth callback error:', error);
    return {
      error: {
        status: 500,
        name: 'NetworkError',
        message: 'Network error during authentication'
      }
    };
  }
}

// Get current user from Strapi with JWT
export async function getCurrentUser(jwt: string): Promise<StrapiUser | null> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    
    const response = await fetch(`${strapiUrl}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Convert Strapi user to your app's user format
export function convertStrapiUser(strapiUser: StrapiUser): {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified: boolean;
} {
  return {
    id: strapiUser.documentId,
    email: strapiUser.email,
    name: strapiUser.username,
    verified: strapiUser.confirmed,
    // Strapi doesn't provide picture by default, you might need to add this field
    picture: undefined
  };
} 