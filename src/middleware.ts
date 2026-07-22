/**
 * Next.js Middleware
 * 
 * Applies security headers and same-origin validation to all requests.
 * Phase 7: Security Hardening
 */

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  applySecurityHeaders(response, request);

  // Same-Origin Validation for API Routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const sameOriginCheck = validateSameOrigin(request);
    if (!sameOriginCheck.allowed) {
      return NextResponse.json(
        { error: "Cross-origin requests not allowed" },
        { status: 403 }
      );
    }
  }

  return response;
}

/**
 * Apply comprehensive security headers
 */
function applySecurityHeaders(response: NextResponse, request: NextRequest): void {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  // Content Security Policy
  // Allows Next.js scripts, styles, WebGL, and same-origin API calls
  const cspDirectives = [
    "default-src 'self'",
    // Next.js App Router emits inline bootstrap/RSC scripts. Without a nonce-based
    // dynamic-rendering setup, production must allow those inline scripts or the
    // page will render as static HTML without hydration (dead buttons/models).
    isDevelopment
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline'",
    // Styles: Allow inline styles for CSS-in-JS and Next.js
    "style-src 'self' 'unsafe-inline'",
    // Images: Allow same-origin and data URIs for WebGL textures
    "img-src 'self' data: blob:",
    // Fonts: Allow same-origin
    "font-src 'self' data:",
    // Connect: API routes and development WebSocket
    isDevelopment
      ? "connect-src 'self' ws://localhost:* ws://127.0.0.1:*"
      : "connect-src 'self'",
    // WebGL and Workers
    "worker-src 'self' blob:",
    // Media
    "media-src 'self'",
    // Frames: Disallow embedding
    "frame-ancestors 'none'",
    // Forms: Same-origin only
    "form-action 'self'",
    // Base URI: Prevent base tag injection
    "base-uri 'self'",
    // Object: Disallow plugins
    "object-src 'none'",
  ];

  response.headers.set(
    "Content-Security-Policy",
    cspDirectives.join("; ")
  );

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer policy: Send only origin for cross-origin, full URL for same-origin
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy: Restrict sensitive features
  response.headers.set(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()", // Disable FLoC
      "payment=()",
      "usb=()",
    ].join(", ")
  );

  // X-Frame-Options: Prevent clickjacking (backup for CSP frame-ancestors)
  response.headers.set("X-Frame-Options", "DENY");

  // Cross-Origin-Opener-Policy: Isolate browsing context
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  // Cross-Origin-Resource-Policy: Prevent cross-origin reads
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // Strict-Transport-Security: HTTPS only in production
  if (isProduction) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // X-DNS-Prefetch-Control: Disable DNS prefetching for privacy
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // X-Download-Options: Prevent file execution in IE
  response.headers.set("X-Download-Options", "noopen");

  // X-Permitted-Cross-Domain-Policies: Restrict Flash/PDF
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
}

/**
 * Validate same-origin requests for API routes
 * 
 * Allows:
 * - Same-origin browser requests
 * - Server-side requests (no Origin header)
 * - Development localhost variations
 * 
 * Rejects:
 * - Cross-origin browser requests
 */
function validateSameOrigin(request: NextRequest): { allowed: boolean; reason?: string } {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const secFetchSite = request.headers.get("sec-fetch-site");

  // Server-side requests (e.g., from API routes, tests) have no Origin
  if (!origin) {
    return { allowed: true };
  }

  // Check Sec-Fetch-Site if available (modern browsers)
  if (secFetchSite === "same-origin" || secFetchSite === "none") {
    return { allowed: true };
  }

  // Parse origin and host
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return { allowed: false, reason: "Invalid origin header" };
  }

  // Same-origin check
  if (originHost === host) {
    return { allowed: true };
  }

  // Development: Allow localhost variations
  if (process.env.NODE_ENV === "development") {
    const localhostPatterns = [
      "localhost:",
      "127.0.0.1:",
      "[::1]:",
    ];

    const isOriginLocalhost = localhostPatterns.some(pattern => originHost.startsWith(pattern));
    const isHostLocalhost = host && localhostPatterns.some(pattern => host.startsWith(pattern));

    if (isOriginLocalhost && isHostLocalhost) {
      return { allowed: true };
    }
  }

  return { allowed: false, reason: "Cross-origin request not allowed" };
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

