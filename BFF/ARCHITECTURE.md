# BFF Architecture

## Overview

Backend-For-Frontend — Express + Google Auth + Clerk Auth + Proxy to CORE.
Single entry point for all clients (web-ui, mobile-app).

## System Context

```mermaid
C4Context
  Person(user, "User", "End user")
  System(web, "Web UI", "React admin panel")
  System(mobile, "Mobile App", "React Native")
  System(bff, "BFF", "Auth + Proxy")
  System(core, "CORE", "Data API")
  System_Ext(clerk, "Clerk", "Auth provider")
  System_Ext(google, "Google", "OAuth provider")

  Rel(user, web, "Uses")
  Rel(user, mobile, "Uses")
  Rel(web, bff, "HTTPS")
  Rel(mobile, bff, "HTTPS")
  Rel(bff, core, "Internal API")
  Rel(bff, clerk, "Verify tokens")
  Rel(bff, google, "Verify tokens")
```

## Auth Flow — Web UI (Google Sign-In)

```mermaid
sequenceDiagram
    participant Browser
    participant BFF
    participant Google
    participant CORE

    Browser->>Google: Sign in with Google
    Google-->>Browser: idToken
    Browser->>BFF: POST /api/auth/google { idToken }
    BFF->>Google: Verify idToken
    Google-->>BFF: User payload
    BFF->>BFF: Check adminEmails whitelist
    BFF-->>Browser: JWT + admin session
    Browser->>BFF: GET /api/leagues (Authorization: Bearer JWT)
    BFF->>CORE: GET /api/leagues (X-API-Key)
    CORE-->>BFF: League data
    BFF-->>Browser: League data
```

## Auth Flow — Mobile App (Clerk)

```mermaid
sequenceDiagram
    participant Mobile
    participant Clerk
    participant BFF
    participant CORE

    Mobile->>Clerk: OAuth (Google/Apple)
    Clerk-->>Mobile: Session token
    Mobile->>BFF: POST /api/auth/clerk (Bearer token)
    BFF->>Clerk: Verify session (verifyToken)
    Clerk-->>BFF: User claims (sub, email, name)
    BFF->>CORE: POST /api/users/sync (API key)
    CORE-->>BFF: User profile
    BFF-->>Mobile: User data
    Note over Mobile,BFF: Token cached in SecureStore
    Mobile->>BFF: GET /api/leagues (Bearer token)
    BFF->>CORE: GET /api/leagues (X-API-Key)
    CORE-->>BFF: Data
    BFF-->>Mobile: Data
```

## Request Flow — Proxy Pattern

```mermaid
sequenceDiagram
    participant Client
    participant BFF
    participant CORE

    Client->>BFF: Any /api/* request (Auth header)
    BFF->>BFF: requireAuth (verify JWT)
    BFF->>CORE: Forward request (X-API-Key)
    CORE-->>BFF: Response
    BFF-->>Client: Response
```

## Architecture Decisions

### Why Clerk + Google Auth?
- **Web UI**: Google Sign-In directly (simple admin auth)
- **Mobile App**: Clerk handles Google + Apple OAuth, session management, token lifecycle
- Clerk's `@clerk/clerk-expo` provides native OAuth flows (not web-based redirects)

### Why Proxy Pattern?
- Single auth boundary (BFF handles all auth)
- CORE is a pure data API — no auth logic
- BFF can add caching, rate limiting, request transformation

### Why SecureStore?
- Clerk tokens stored in `expo-secure-store` (Keychain on iOS, EncryptedSharedPreferences on Android)
- NOT AsyncStorage — tokens must be encrypted

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/google | None | Google Sign-In (web) |
| POST | /api/auth/clerk | Clerk | Clerk auth sync (mobile) |
| GET | /api/users/me | Clerk | Current user |
| PATCH | /api/users/me/preferences | Clerk | Update preferences |
| GET | /api/users/me/follows | Clerk | Get follows |
| POST | /api/users/me/follows | Clerk | Follow entity |
| DELETE | /api/users/me/follows/:id | Clerk | Unfollow |
| GET | /api/* | JWT | Proxy to CORE |
| POST | /api/* | JWT | Proxy to CORE |
| PATCH | /api/* | JWT | Proxy to CORE |
| DELETE | /api/* | JWT | Proxy to CORE |

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | BFF port (default: 4001) |
| CORE_API_URL | CORE base URL |
| CORE_API_KEY | Shared secret with CORE |
| JWT_SECRET | JWT signing key (web-ui auth) |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| ADMIN_EMAILS | Comma-separated admin emails |
| CLERK_SECRET_KEY | Clerk API secret key |
| CLERK_PUBLISHABLE_KEY | Clerk publishable key |
| CORS_ORIGIN | Allowed CORS origin |
