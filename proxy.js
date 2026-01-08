import {NextResponse} from "next/server";
import {COGNITO} from "./env.js";
import {fetchNewTokens, verifyIdToken, verifyAccessToken} from "./server/features/authentication/AuthenticationService.js";

// Simple in-memory cache for token validation (TTL: 5 minutes)
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedValidation(tokenKey) {
    const cached = tokenCache.get(tokenKey);
    if (cached && Date.now() < cached.expiresAt) {
        return cached.valid;
    }
    tokenCache.delete(tokenKey);
    return null;
}

function setCachedValidation(tokenKey, isValid) {
    tokenCache.set(tokenKey, {
        valid: isValid,
        expiresAt: Date.now() + CACHE_TTL
    });
    // Clean up old entries periodically
    if (tokenCache.size > 1000) {
        const now = Date.now();
        for (const [key, value] of tokenCache.entries()) {
            if (now >= value.expiresAt) {
                tokenCache.delete(key);
            }
        }
    }
}

export async function proxy(request) {
    const response = NextResponse.next();
    const {pathname} = request.nextUrl;
    
    const goToLogin = () => {
        if (!(pathname === '/')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return response;
    }
    
    const goToPanel = () => {
        return NextResponse.redirect(new URL('/logged', request.url));
    }

    // Early return for login page if no auth
    if (pathname === '/') {
        const username = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.LastAuthUser`)?.value;
        if (username) {
            return goToPanel();
        }
        return response;
    }

    const username = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.LastAuthUser`)?.value;
    if (!username) return goToLogin();
    
    const cookieKeys = {
        id: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.idToken`,
        access: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.accessToken`,
        refresh: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.refreshToken`
    }
    
    const refreshToken = request.cookies.get(cookieKeys.refresh)?.value
    if (!refreshToken) {
        return goToLogin()
    }

    let idToken = request.cookies.get(cookieKeys.id)?.value
    let accessToken = request.cookies.get(cookieKeys.access)?.value

    // Check cache first
    const cacheKey = `${idToken?.substring(0, 50)}_${accessToken?.substring(0, 50)}`;
    const cachedResult = getCachedValidation(cacheKey);
    
    if (cachedResult === true) {
        // Token is valid from cache
        return response;
    }

    // Validate tokens directly (no internal fetch)
    if (idToken && accessToken) {
        try {
            // Validate tokens in parallel
            await Promise.all([
                verifyIdToken(idToken),
                verifyAccessToken(accessToken)
            ]);
            
            // Cache successful validation
            setCachedValidation(cacheKey, true);
            return response;
        } catch (e) {
            // Token validation failed, try to refresh
            setCachedValidation(cacheKey, false);
        }
    }

    // If validation failed or tokens missing, try to refresh
    try {
        const data = await fetchNewTokens(refreshToken);
        idToken = data.id_token;
        accessToken = data.access_token;
        
        response.cookies.set({
            name: cookieKeys.access,
            value: accessToken,
            secure: true,
            httpOnly: false,
            sameSite: 'lax',
            maxAge: data.expires_in || 3600
        })

        response.cookies.set({
            name: cookieKeys.id,
            value: idToken,
            secure: true,
            httpOnly: false,
            sameSite: 'lax',
            maxAge: data.expires_in || 3600
        })
        
        // Cache new tokens
        const newCacheKey = `${idToken.substring(0, 50)}_${accessToken.substring(0, 50)}`;
        setCachedValidation(newCacheKey, true);
        
        return response;
    } catch (e) {
        return goToLogin();
    }
}

export const config = {
    // More specific matcher to exclude static assets
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
    ],
}

