# FOTMOB-CORE Architecture

## Overview

Core Data API — Express + TypeScript + Prisma + PostgreSQL.
Serves all football data. Consumed exclusively by BFF via internal API key.

## System Context

```mermaid
C4Context
  Person(user, "User", "Mobile or web app user")
  System(mobile, "Mobile App", "React Native (Expo)")
  System(web, "Web UI", "React (Vite)")
  System(bff, "BFF", "Auth gateway + proxy")
  System(core, "FOTMOB-CORE", "Data API")
  SystemDb(db, "PostgreSQL", "Railway")

  Rel(user, mobile, "Uses")
  Rel(user, web, "Uses")
  Rel(mobile, bff, "API calls", "REST/JSON")
  Rel(web, bff, "API calls", "REST/JSON")
  Rel(bff, core, "Proxies requests", "Internal API key")
  Rel(core, db, "Reads/Writes")
```

## Data Flow — Admin Goal Cascade

```mermaid
sequenceDiagram
    actor Admin
    Admin->>BFF: POST /api/matches/:id/events
    BFF->>CORE: Proxy with API key
    CORE->>CORE: Begin transaction (20s timeout)
    CORE->>DB: Create MatchEvent
    CORE->>DB: Increment match score
    CORE->>DB: Upsert PlayerStats (goals/assists)
    CORE->>DB: Update Standings (GF/GA/GD)
    CORE->>CORE: Recalculate positions
    CORE-->>BFF: Updated match data
    BFF-->>Admin: Response
```

## Data Flow — Google Sign-In (Web UI)

```mermaid
sequenceDiagram
    actor Admin
    Admin->>WebUI: Click Google Sign-In
    WebUI->>Google: OAuth token
    Google-->>WebUI: idToken
    WebUI->>BFF: POST /api/auth/google { idToken }
    BFF->>Google: Verify token
    Google-->>BFF: Payload
    BFF->>BFF: Check admin email whitelist
    BFF-->>WebUI: JWT + admin session
    WebUI->>BFF: API calls with JWT
    BFF->>CORE: Proxy with API key
    CORE-->>BFF: Data
    BFF-->>WebUI: Data
```

## Data Flow — Clerk Auth (Mobile App)

```mermaid
sequenceDiagram
    actor User
    User->>Mobile: Open app
    Mobile->>Clerk: OAuth (Google/Apple)
    Clerk-->>Mobile: Session token
    Mobile->>BFF: POST /api/auth/clerk (Bearer token)
    BFF->>Clerk: Verify session
    Clerk-->>BFF: User claims
    BFF->>CORE: POST /api/users/sync
    CORE-->>BFF: User profile
    BFF-->>Mobile: User data
    Mobile->>BFF: API calls (Bearer token)
    BFF->>CORE: Proxy + attach userId
    CORE-->>BFF: Data
    BFF-->>Mobile: Data
```

## Data Flow — User Follow

```mermaid
sequenceDiagram
    actor User
    User->>Mobile: Follow team/player/league
    Mobile->>BFF: POST /users/me/follows
    BFF->>CORE: POST /api/users/:id/follows
    CORE->>DB: INSERT user_follows
    CORE-->>BFF: Follow record
    BFF-->>Mobile: Success
```

## Entity Relationship

```mermaid
erDiagram
    League ||--o{ Match : has
    League ||--o{ Standing : has
    League ||--o{ PlayerStats : has
    League ||--o{ News : has
    Team ||--o{ Match : home
    Team ||--o{ Match : away
    Team ||--o{ Player : squad
    Team ||--o{ Standing : has
    Team ||--o{ PlayerStats : has
    Team ||--o{ Transfer : from
    Team ||--o{ Transfer : to
    Player ||--o{ MatchEvent : scores
    Player ||--o{ PlayerStats : has
    Player ||--o{ Transfer : transfers
    Match ||--o{ MatchEvent : events
    User ||--o{ UserFollow : follows
```

## Models

| Model | Table | Key Fields |
|-------|-------|------------|
| League | leagues | name, slug, country, type, season |
| Team | teams | name, shortName, slug, logoUrl, country |
| Player | players | name, slug, position, teamId |
| Match | matches | homeTeamId, awayTeamId, leagueId, status, score |
| MatchEvent | match_events | matchId, teamId, playerId, type, minute |
| Standing | standings | leagueId, teamId, position, points |
| PlayerStats | player_stats | playerId, leagueId, season, goals, assists |
| Transfer | transfers | playerId, fromTeamId, toTeamId, fee |
| News | news | title, slug, content, category |
| Admin | admins | email, googleId, role |
| User | users | clerkId, email, preferences |
| UserFollow | user_follows | userId, entityType, entityId |

## Endpoints

### Public (no auth)
- `GET /api/leagues` — List leagues
- `GET /api/leagues/:id` — League detail
- `GET /api/leagues/:id/standings` — Standings
- `GET /api/teams` — List teams
- `GET /api/teams/:id` — Team detail with squad
- `GET /api/matches` — List matches (filter: leagueId, teamId, status)
- `GET /api/matches/:id` — Match detail
- `GET /api/matches/:id/events` — Match events
- `GET /api/players/:id` — Player detail
- `GET /api/transfers` — Transfers
- `GET /api/news` — News
- `GET /api/search?q=` — Search

### Admin (API key via X-API-Key header)
- `POST /api/admin/*` — All CRUD operations
- `POST /api/matches/:matchId/events` — Record event (goal cascade)
- `PATCH /api/matches/:matchId/status` — Update match status

### User (API key, userId passed by BFF)
- `POST /api/users/sync` — Create/update user
- `GET /api/users/:id` — Get user
- `PATCH /api/users/:id/preferences` — Update preferences
- `GET /api/users/:id/follows` — Get follows
- `POST /api/users/:id/follows` — Follow entity
- `DELETE /api/users/:id/follows/:followId` — Unfollow
