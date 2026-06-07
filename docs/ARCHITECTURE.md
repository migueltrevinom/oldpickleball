# OldPickleball — Architecture Plan

> **Pickleball Super App** — Court finder, game organizer, community hub.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Database Design (MongoDB / Mongoose)](#3-database-design)
4. [Backend API (Koa.js)](#4-backend-api-koajs)
5. [Authentication (JWT)](#5-authentication-jwt)
6. [Angular App](#6-angular-app)
7. [Landing Page (Next.js)](#7-landing-page-nextjs)
8. [MVP Feature Phases](#8-mvp-feature-phases)
9. [API Contract Overview](#9-api-contract-overview)
10. [Infrastructure & DevOps](#10-infrastructure--devops)

---

## 1. Tech Stack

| Layer | Technology | Version Target |
|---|---|---|
| **Database** | MongoDB (Atlas or self-hosted) | 7.x+ |
| **ODM** | Mongoose | 8.x+ |
| **Backend** | Koa.js on Node.js | Koa 2.x, Node 20 LTS+ |
| **Web App** | Angular | 17+ (standalone components) |
| **Landing Page** | React + Next.js | Next.js 14+ (App Router) |
| **Auth** | JWT (access + refresh tokens) | jsonwebtoken / jose |
| **Payments** | Stripe (future) | — |
| **Real-time** | Socket.IO or WebSockets via Koa | — |
| **Maps** | Google Maps / Mapbox | — |
| **Package Manager** | pnpm (workspaces) | 9.x+ |
| **Containerization** | Docker + Docker Compose | — |

---

## 2. Monorepo Structure

```
oldpickleball/
├── apps/
│   ├── api/                    # Koa.js backend
│   │   ├── src/
│   │   │   ├── config/         # env, db connection, constants
│   │   │   ├── middleware/     # auth, error handler, logger, cors
│   │   │   ├── models/         # Mongoose schemas/models
│   │   │   ├── routes/         # Koa router definitions
│   │   │   ├── controllers/    # Route handlers / business logic
│   │   │   ├── services/       # Domain logic (matching, notifications)
│   │   │   ├── validators/     # Request validation (Joi / Zod)
│   │   │   ├── utils/          # Helpers (geo, token, pagination)
│   │   │   ├── sockets/        # WebSocket event handlers (chat, live)
│   │   │   └── app.ts          # Koa app bootstrap
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                    # Angular app (main product)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/       # Guards, interceptors, auth service
│   │   │   │   ├── shared/     # Reusable components, pipes, directives
│   │   │   │   ├── features/   # Feature modules (courts, sessions, chat...)
│   │   │   │   ├── layouts/    # Shell layout, nav, sidebar
│   │   │   │   └── app.routes.ts
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   └── styles/
│   │   ├── package.json
│   │   ├── angular.json
│   │   └── tsconfig.json
│   │
│   └── landing/                # Next.js landing / marketing site
│       ├── src/
│       │   └── app/            # App Router pages
│       │       ├── page.tsx    # Home
│       │       ├── features/
│       │       ├── pricing/
│       │       ├── about/
│       │       └── layout.tsx
│       ├── public/
│       ├── package.json
│       ├── next.config.js
│       └── tsconfig.json
│
├── packages/
│   └── shared/                 # Shared TypeScript types & utilities
│       ├── src/
│       │   ├── types/          # Interfaces: User, Court, Session, etc.
│       │   ├── constants/      # Skill levels, court types, enums
│       │   └── utils/          # Shared helpers (date, geo, validation)
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                       # Architecture & planning docs
│   └── ARCHITECTURE.md
├── docker-compose.yml          # MongoDB, API, optional services
├── pnpm-workspace.yaml
├── package.json                # Root workspace config
├── tsconfig.base.json          # Shared TS config
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

### Workspace Configuration

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files | kebab-case | `court-finder.service.ts` |
| Classes | PascalCase | `CourtFinderService` |
| Interfaces/Types | PascalCase, prefixed `I` for interfaces | `IUser`, `CourtType` |
| DB Collections | lowercase plural | `users`, `courts`, `sessions` |
| API routes | lowercase plural, kebab-case | `/api/v1/courts`, `/api/v1/open-play` |
| Env variables | SCREAMING_SNAKE | `MONGO_URI`, `JWT_SECRET` |

---

## 3. Database Design

### 3.1 Entity Relationship Overview

```
User ──┬── owns ──── Court (if venue owner)
       ├── creates ── Session
       ├── joins ──── RSVP ──── Session
       ├── sends ──── Message ──── ChatRoom ──── Session
       ├── rates ──── PlayerRating ──── User (target)
       ├── receives ── Notification
       └── has ────── PlayerProfile (embedded)
```

### 3.2 Mongoose Schemas

#### User

```
User {
  _id:              ObjectId
  email:            String (unique, indexed)
  passwordHash:     String
  role:             Enum ['player', 'coach', 'venue_owner', 'admin']
  profile: {
    firstName:      String
    lastName:       String
    displayName:    String
    avatar:         String (URL)
    bio:            String
    phone:          String (optional)
    location: {
      type:         'Point'
      coordinates:  [lng, lat]
      city:         String
      state:        String
      zip:          String
    }
  }
  skill: {
    selfRated:      Number (1.0 – 5.5, step 0.5)
    duprId:         String (optional)
    duprRating:     Number (optional, synced)
    preferredFormats: [Enum: 'singles', 'doubles', 'mixed']
  }
  social: {
    friends:        [ObjectId → User]
    blockedUsers:   [ObjectId → User]
  }
  stats: {
    gamesPlayed:    Number (default: 0)
    gamesOrganized: Number (default: 0)
    reliability:    Number (0–100, computed from no-show rate)
    avgRating:      Number (1–5)
    ratingCount:    Number
  }
  settings: {
    notifications: {
      push:         Boolean (default: true)
      email:        Boolean (default: true)
      nearbyGames:  Boolean (default: true)
      reminders:    Boolean (default: true)
    }
    searchRadius:   Number (miles, default: 25)
    visibility:     Enum ['public', 'friends', 'private']
  }
  refreshTokens:    [{ token: String, expiresAt: Date, device: String }]
  isVerified:       Boolean (default: false)
  isActive:         Boolean (default: true)
  lastActiveAt:     Date
  createdAt:        Date
  updatedAt:        Date
}

Indexes:
  - { email: 1 } unique
  - { 'profile.location': '2dsphere' }
  - { 'skill.selfRated': 1 }
  - { 'skill.duprRating': 1 }
```

#### Court

```
Court {
  _id:              ObjectId
  name:             String (indexed)
  slug:             String (unique)
  description:      String
  location: {
    type:           'Point'
    coordinates:    [lng, lat]
    address:        String
    city:           String
    state:          String
    zip:            String
    country:        String (default: 'US')
  }
  details: {
    courtCount:     Number
    surfaceType:    Enum ['concrete', 'asphalt', 'wood', 'sport_court', 'other']
    environment:    Enum ['indoor', 'outdoor', 'covered']
    lighting:       Boolean
    hasNets:        Boolean (default: true)
  }
  amenities:        [Enum: 'restrooms', 'water', 'parking', 'pro_shop',
                          'seating', 'food', 'lockers', 'wheelchair_accessible']
  access: {
    type:           Enum ['public', 'private', 'semi_private', 'membership']
    fee:            Number (0 for free)
    feePer:         Enum ['hour', 'session', 'day', 'month']
    reservationUrl: String (external booking link, optional)
  }
  hours: {
    monday:         { open: String, close: String } | null
    tuesday:        ...
    ...
    sunday:         ...
  }
  photos:           [String] (URLs)
  owner:            ObjectId → User (optional, for venue owners)
  community: {
    addedBy:        ObjectId → User
    verifiedBy:     [ObjectId → User]
    lastVerified:   Date
    edits:          [{
      userId:       ObjectId → User
      field:        String
      oldValue:     Mixed
      newValue:     Mixed
      timestamp:    Date
      status:       Enum ['pending', 'approved', 'rejected']
    }]
  }
  ratings: {
    avgRating:      Number (1–5)
    ratingCount:    Number
  }
  isActive:         Boolean (default: true)
  createdAt:        Date
  updatedAt:        Date
}

Indexes:
  - { location: '2dsphere' }
  - { slug: 1 } unique
  - { 'details.environment': 1, 'details.surfaceType': 1 }
  - { 'access.type': 1 }
  - { 'ratings.avgRating': -1 }
```

#### Session (Open Play / Game / Event)

```
Session {
  _id:              ObjectId
  title:            String
  description:      String
  type:             Enum ['open_play', 'round_robin', 'ladder', 'casual',
                          'drill', 'lesson', 'tournament']
  format:           Enum ['singles', 'doubles', 'mixed', 'any']
  court:            ObjectId → Court
  organizer:        ObjectId → User
  schedule: {
    startTime:      Date (indexed)
    endTime:        Date
    recurring:      {
      enabled:      Boolean (default: false)
      frequency:    Enum ['daily', 'weekly', 'biweekly', 'monthly']
      endDate:      Date (optional)
      parentId:     ObjectId → Session (original recurring session)
    }
  }
  skillRange: {
    min:            Number (1.0)
    max:            Number (5.5)
  }
  capacity: {
    min:            Number (default: 2)
    max:            Number (default: 16)
    spotsAvailable: Number (computed)
  }
  cost: {
    amount:         Number (0 for free)
    currency:       String (default: 'USD')
    splitEvenly:    Boolean (default: true)
    perPlayer:      Number (computed or set)
  }
  status:           Enum ['draft', 'open', 'full', 'in_progress',
                          'completed', 'cancelled']
  visibility:       Enum ['public', 'friends', 'invite_only']
  chatRoom:         ObjectId → ChatRoom
  createdAt:        Date
  updatedAt:        Date
}

Indexes:
  - { court: 1, 'schedule.startTime': 1 }
  - { organizer: 1 }
  - { status: 1, 'schedule.startTime': 1 }
  - { 'skillRange.min': 1, 'skillRange.max': 1 }
  - { type: 1 }
```

#### RSVP

```
RSVP {
  _id:              ObjectId
  session:          ObjectId → Session
  user:             ObjectId → User
  status:           Enum ['confirmed', 'waitlisted', 'cancelled', 'no_show']
  position:         Number (waitlist order, null if confirmed)
  respondedAt:      Date
  cancelledAt:      Date (optional)
  checkedIn:        Boolean (default: false)
  checkedInAt:      Date (optional)
  createdAt:        Date
  updatedAt:        Date
}

Indexes:
  - { session: 1, user: 1 } unique compound
  - { session: 1, status: 1 }
  - { user: 1, status: 1 }
```

#### ChatRoom & Message

```
ChatRoom {
  _id:              ObjectId
  name:             String
  type:             Enum ['session', 'direct', 'group', 'court']
  session:          ObjectId → Session (optional)
  court:            ObjectId → Court (optional)
  participants:     [ObjectId → User]
  lastMessage: {
    content:        String
    sender:         ObjectId → User
    sentAt:         Date
  }
  isActive:         Boolean (default: true)
  createdAt:        Date
  updatedAt:        Date
}

Indexes:
  - { participants: 1 }
  - { session: 1 }
  - { 'lastMessage.sentAt': -1 }

Message {
  _id:              ObjectId
  chatRoom:         ObjectId → ChatRoom
  sender:           ObjectId → User
  content:          String
  type:             Enum ['text', 'image', 'system']
  readBy:           [{ user: ObjectId, readAt: Date }]
  isDeleted:        Boolean (default: false)
  createdAt:        Date
}

Indexes:
  - { chatRoom: 1, createdAt: -1 }
  - { sender: 1 }
```

#### PlayerRating (post-game feedback)

```
PlayerRating {
  _id:              ObjectId
  session:          ObjectId → Session
  rater:            ObjectId → User
  target:           ObjectId → User
  overall:          Number (1–5)
  tags:             [Enum: 'reliable', 'fun', 'competitive', 'good_sport',
                          'punctual', 'skilled', 'great_partner']
  comment:          String (optional, max 280 chars)
  createdAt:        Date
}

Indexes:
  - { target: 1, createdAt: -1 }
  - { session: 1, rater: 1, target: 1 } unique compound
```

#### Notification

```
Notification {
  _id:              ObjectId
  user:             ObjectId → User
  type:             Enum ['session_invite', 'session_reminder', 'rsvp_update',
                          'waitlist_promoted', 'new_session_nearby',
                          'friend_request', 'chat_message', 'rating_received',
                          'system']
  title:            String
  body:             String
  data: {
    entityType:     Enum ['session', 'court', 'user', 'chatRoom']
    entityId:       ObjectId
    deepLink:       String
  }
  channels:         [Enum: 'push', 'email', 'in_app']
  isRead:           Boolean (default: false)
  readAt:           Date
  createdAt:        Date
}

Indexes:
  - { user: 1, isRead: 1, createdAt: -1 }
  - { user: 1, type: 1 }
```

---

## 4. Backend API (Koa.js)

### 4.1 Middleware Stack

```
Request Flow:

  → koa-helmet (security headers)
  → koa-cors (CORS config)
  → koa-bodyparser (JSON body)
  → request-logger (custom, logs method/path/status/duration)
  → error-handler (custom, catches + formats errors)
  → rate-limiter (koa-ratelimit, per IP/user)
  → auth-middleware (JWT verification, attaches ctx.state.user)
  → router (koa-router, versioned under /api/v1)
  → 404 handler
```

### 4.2 Route Map

```
Auth
  POST   /api/v1/auth/register          # Create account
  POST   /api/v1/auth/login             # Email + password → tokens
  POST   /api/v1/auth/refresh           # Refresh token → new access token
  POST   /api/v1/auth/logout            # Revoke refresh token
  POST   /api/v1/auth/forgot-password   # Send reset email
  POST   /api/v1/auth/reset-password    # Reset with token
  GET    /api/v1/auth/verify/:token     # Email verification

Users
  GET    /api/v1/users/me               # Current user profile
  PATCH  /api/v1/users/me               # Update profile
  GET    /api/v1/users/:id              # Public profile
  GET    /api/v1/users/:id/stats        # Player stats
  POST   /api/v1/users/:id/friend      # Send friend request
  DELETE /api/v1/users/:id/friend      # Remove friend
  GET    /api/v1/users/nearby           # Players near location

Courts
  GET    /api/v1/courts                 # List/search courts (geo, filters)
  GET    /api/v1/courts/:id             # Court detail
  POST   /api/v1/courts                 # Add new court (community)
  PATCH  /api/v1/courts/:id             # Suggest edit
  GET    /api/v1/courts/:id/sessions    # Sessions at this court
  POST   /api/v1/courts/:id/verify     # Verify court info is accurate
  GET    /api/v1/courts/nearby          # Geo-query nearby courts

Sessions
  GET    /api/v1/sessions               # List/search sessions (filters)
  GET    /api/v1/sessions/:id           # Session detail + RSVPs
  POST   /api/v1/sessions               # Create session
  PATCH  /api/v1/sessions/:id           # Update session (organizer)
  DELETE /api/v1/sessions/:id           # Cancel session (organizer)
  GET    /api/v1/sessions/nearby        # Nearby open sessions
  GET    /api/v1/sessions/feed          # Personalized feed

RSVPs
  POST   /api/v1/sessions/:id/rsvp     # Join session
  PATCH  /api/v1/sessions/:id/rsvp     # Update RSVP status
  DELETE /api/v1/sessions/:id/rsvp     # Cancel RSVP
  GET    /api/v1/sessions/:id/rsvp     # List RSVPs for session

Chat
  GET    /api/v1/chatrooms              # User's chat rooms
  GET    /api/v1/chatrooms/:id          # Chat room detail
  GET    /api/v1/chatrooms/:id/messages # Messages (paginated)
  POST   /api/v1/chatrooms/:id/messages # Send message (REST fallback)

  WebSocket Events (Socket.IO):
    connect          → authenticate with JWT
    join-room        → join a chat room
    leave-room       → leave a chat room
    send-message     → broadcast message to room
    typing           → typing indicator
    message-read     → mark messages read

Ratings
  POST   /api/v1/sessions/:id/ratings  # Rate players after session
  GET    /api/v1/users/:id/ratings     # Get ratings for a user

Notifications
  GET    /api/v1/notifications          # User's notifications (paginated)
  PATCH  /api/v1/notifications/:id/read # Mark as read
  POST   /api/v1/notifications/read-all # Mark all as read
  GET    /api/v1/notifications/unread-count
```

### 4.3 Controller Pattern

Each controller follows a consistent pattern:

```typescript
// controllers/court.controller.ts
import { Context } from 'koa';
import { CourtService } from '../services/court.service';

export class CourtController {
  static async list(ctx: Context) {
    const { lat, lng, radius, surface, environment, access } = ctx.query;
    const courts = await CourtService.search({ lat, lng, radius, filters: { surface, environment, access } });
    ctx.body = { success: true, data: courts };
  }

  static async getById(ctx: Context) {
    const court = await CourtService.findById(ctx.params.id);
    ctx.body = { success: true, data: court };
  }

  static async create(ctx: Context) {
    const court = await CourtService.create(ctx.request.body, ctx.state.user.id);
    ctx.status = 201;
    ctx.body = { success: true, data: court };
  }
}
```

### 4.4 Service Layer Pattern

Services contain domain logic, keeping controllers thin:

```typescript
// services/court.service.ts
export class CourtService {
  static async search({ lat, lng, radius, filters }) {
    const query: any = {};

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: (radius || 25) * 1609.34 // miles → meters
        }
      };
    }

    if (filters.surface) query['details.surfaceType'] = filters.surface;
    if (filters.environment) query['details.environment'] = filters.environment;

    return Court.find(query).limit(50).lean();
  }
}
```

### 4.5 Error Handling

```typescript
// middleware/error-handler.ts
export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  try {
    await next();
  } catch (err: any) {
    const status = err.status || err.statusCode || 500;
    ctx.status = status;
    ctx.body = {
      success: false,
      error: {
        message: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    };
  }
}
```

---

## 5. Authentication (JWT)

### 5.1 Token Strategy

| Token | Lifetime | Storage (Angular) | Purpose |
|---|---|---|---|
| **Access Token** | 15 minutes | Memory (variable/service) | API authorization |
| **Refresh Token** | 7 days | HttpOnly cookie or secure storage | Obtain new access token |

### 5.2 Auth Flow

```
┌─────────────┐         ┌──────────┐         ┌──────────┐
│  Angular App │         │  Koa API  │         │  MongoDB  │
└──────┬──────┘         └────┬─────┘         └────┬─────┘
       │                     │                     │
  1.   │  POST /auth/login   │                     │
       │  { email, password }│                     │
       │────────────────────>│                     │
       │                     │  Find user, verify  │
       │                     │────────────────────>│
       │                     │<────────────────────│
       │                     │                     │
       │                     │  Generate tokens    │
       │                     │  Store refresh in DB│
       │                     │────────────────────>│
       │                     │                     │
  2.   │  { accessToken }    │                     │
       │  + Set-Cookie:      │                     │
       │    refreshToken     │                     │
       │<────────────────────│                     │
       │                     │                     │
  3.   │  GET /api/v1/courts │                     │
       │  Authorization:     │                     │
       │  Bearer <access>    │                     │
       │────────────────────>│                     │
       │                     │  Verify JWT         │
       │                     │  Attach user to ctx │
       │  { data: [...] }   │                     │
       │<────────────────────│                     │
       │                     │                     │
  4.   │  POST /auth/refresh │                     │
       │  Cookie: refresh    │                     │
       │────────────────────>│                     │
       │                     │  Verify refresh     │
       │                     │  Rotate token       │
       │                     │────────────────────>│
       │  { accessToken }    │                     │
       │  + new cookie       │                     │
       │<────────────────────│                     │
```

### 5.3 JWT Payload

```json
{
  "sub": "userId",
  "email": "user@example.com",
  "role": "player",
  "iat": 1700000000,
  "exp": 1700000900
}
```

### 5.4 Angular Auth Integration

```
HttpInterceptor
  ├── Attaches Bearer token to all /api requests
  ├── On 401 → calls /auth/refresh
  │   ├── Success → retry original request with new token
  │   └── Failure → redirect to /login
  └── Queues concurrent requests during refresh

AuthGuard
  ├── canActivate checks token validity
  ├── Redirects unauthenticated users to /login
  └── Role-based guards for admin/coach routes

AuthService
  ├── login(email, password) → stores access token in memory
  ├── logout() → calls /auth/logout, clears state
  ├── refreshToken() → obtains new access token
  ├── isAuthenticated() → checks token expiry
  └── currentUser$ → BehaviorSubject<User | null>
```

---

## 6. Angular App

### 6.1 Feature Modules

```
app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.interceptor.ts
│   │   └── token.service.ts
│   ├── services/
│   │   ├── api.service.ts           # Base HTTP wrapper
│   │   ├── notification.service.ts
│   │   ├── socket.service.ts        # WebSocket client
│   │   └── geolocation.service.ts
│   └── models/                      # TypeScript interfaces
│
├── shared/
│   ├── components/
│   │   ├── map/                     # Reusable map component
│   │   ├── court-card/
│   │   ├── session-card/
│   │   ├── player-avatar/
│   │   ├── skill-badge/
│   │   ├── rating-stars/
│   │   ├── loading-spinner/
│   │   └── empty-state/
│   ├── pipes/
│   │   ├── relative-time.pipe.ts
│   │   ├── distance.pipe.ts
│   │   └── skill-label.pipe.ts
│   └── directives/
│       └── infinite-scroll.directive.ts
│
├── features/
│   ├── courts/                      # Court Finder
│   │   ├── court-list/              # Map + list view with filters
│   │   ├── court-detail/            # Court page with sessions
│   │   ├── court-form/              # Add/edit court (community)
│   │   └── courts.routes.ts
│   │
│   ├── sessions/                    # Game Organization
│   │   ├── session-list/            # Browse sessions (feed)
│   │   ├── session-detail/          # Detail + RSVP + participants
│   │   ├── session-create/          # Create/edit session
│   │   ├── session-calendar/        # Calendar view
│   │   └── sessions.routes.ts
│   │
│   ├── chat/                        # In-App Messaging
│   │   ├── chat-list/               # Conversation list
│   │   ├── chat-room/               # Message thread
│   │   └── chat.routes.ts
│   │
│   ├── profile/                     # Player Profiles
│   │   ├── my-profile/              # Edit own profile
│   │   ├── public-profile/          # View other players
│   │   ├── ratings-list/            # Received ratings
│   │   └── profile.routes.ts
│   │
│   ├── notifications/               # Notification Center
│   │   ├── notification-list/
│   │   └── notifications.routes.ts
│   │
│   ├── auth/                        # Login / Register
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── auth.routes.ts
│   │
│   └── discover/                    # Feed / Looking for Play
│       ├── feed/
│       ├── nearby-players/
│       └── discover.routes.ts
│
├── layouts/
│   ├── main-layout/                 # Authenticated shell (nav, tabs)
│   └── auth-layout/                 # Unauthenticated shell
│
└── app.routes.ts                    # Root routing
```

### 6.2 State Management

For MVP, use Angular's built-in tools:

- **Services with `BehaviorSubject`** for local/feature state
- **`@ngrx/signals`** or **NgRx Signal Store** for shared state (auth, user, notifications)
- Upgrade to full NgRx store only if complexity warrants it

### 6.3 Key Libraries

| Library | Purpose |
|---|---|
| `@angular/material` or `PrimeNG` | UI components |
| `@angular/google-maps` or `ngx-mapbox-gl` | Map integration |
| `socket.io-client` | Real-time chat/notifications |
| `date-fns` | Date formatting |
| `ngx-infinite-scroll` | Lazy loading lists |

---

## 7. Landing Page (Next.js)

### 7.1 Page Structure

```
landing/src/app/
├── layout.tsx              # Root layout (header, footer)
├── page.tsx                # Home — hero, value prop, CTA
├── features/
│   └── page.tsx            # Feature showcase
├── pricing/
│   └── page.tsx            # Pricing tiers (future)
├── about/
│   └── page.tsx            # Team, mission
├── blog/
│   ├── page.tsx            # Blog list (SEO)
│   └── [slug]/
│       └── page.tsx        # Blog post
├── download/
│   └── page.tsx            # App store links / web app link
└── components/
    ├── Header.tsx
    ├── Footer.tsx
    ├── Hero.tsx
    ├── FeatureCard.tsx
    ├── Testimonial.tsx
    ├── CTABanner.tsx
    └── CourtMapPreview.tsx  # Interactive preview of court finder
```

### 7.2 Tech Choices

| Concern | Choice |
|---|---|
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| SEO | Next.js metadata API + structured data |
| Analytics | PostHog or Plausible (privacy-first) |
| CMS (blog) | MDX files or headless CMS (Contentlayer) |

### 7.3 Key Pages — MVP

- **Home**: Hero video/image, 3 value props, court finder preview, CTA to sign up
- **Features**: Detailed feature breakdown with screenshots
- **Download / Get Started**: Link to Angular web app

---

## 8. MVP Feature Phases

### Phase 1 — Launch (Weeks 1–4)

> Goal: Get players finding courts and joining games.

| Feature | Description | Priority |
|---|---|---|
| **Auth** | Register, login, JWT, email verify | P0 |
| **Court Finder** | Map view, geo search, filters (surface, indoor/outdoor, access) | P0 |
| **Add Court** | Community-submitted courts with verification | P0 |
| **Create Session** | Organizer creates open play / casual game | P0 |
| **Session Feed** | Browse nearby sessions with skill/time filters | P0 |
| **RSVP** | Join, waitlist, cancel with auto-promotion | P0 |
| **Player Profile** | Basic profile with skill level, avatar | P0 |
| **Landing Page** | Home + features + CTA | P0 |

### Phase 2 — Engagement (Weeks 5–8)

> Goal: Keep players coming back with social + communication.

| Feature | Description | Priority |
|---|---|---|
| **Session Chat** | Per-session group chat (WebSocket) | P1 |
| **Notifications** | Push + in-app for new sessions, reminders, RSVPs | P1 |
| **Player Ratings** | Post-game thumbs up/tags (reliable, fun, etc.) | P1 |
| **Recurring Sessions** | Weekly/biweekly auto-created sessions | P1 |
| **"Looking for Play" Feed** | Post availability, invite nearby players | P1 |
| **Friend System** | Add friends, see their sessions | P1 |

### Phase 3 — Growth (Weeks 9–12)

> Goal: Monetization hooks and deeper features.

| Feature | Description | Priority |
|---|---|---|
| **DUPR Integration** | Sync skill ratings from DUPR API | P2 |
| **In-App Payments** | Stripe for session fees, court fees | P2 |
| **Fee Splitting** | Auto-split costs among confirmed players | P2 |
| **Coach Profiles** | Directory with availability, pricing, specialties | P2 |
| **Lesson Booking** | Book private/group lessons with in-app payment | P2 |

### Phase 4 — Scale (Weeks 13+)

| Feature | Description | Priority |
|---|---|---|
| **Smart Matching** | Auto-suggest games by skill, location, time, format | P3 |
| **Round Robins & Ladders** | Structured competitive formats | P3 |
| **Performance Tracking** | Log games, W/L, improvement graphs | P3 |
| **Social Feed** | Activity feed, local news, highlights | P3 |
| **Court Ratings & Reviews** | Rate courts, leave reviews | P3 |
| **Venue Owner Dashboard** | Manage courts, view bookings, analytics | P3 |

---

## 9. API Contract Overview

### Standard Response Envelope

```json
// Success
{
  "success": true,
  "data": { ... } | [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "message": "Court not found",
    "code": "NOT_FOUND",
    "details": []
  }
}
```

### Pagination

All list endpoints support cursor-based or offset pagination:

```
GET /api/v1/sessions?page=2&limit=20&sort=-schedule.startTime
```

### Geo Queries

```
GET /api/v1/courts?lat=40.0150&lng=-75.2700&radius=10&unit=miles
GET /api/v1/sessions/nearby?lat=40.0150&lng=-75.2700&radius=15
```

### Filtering

```
GET /api/v1/sessions?type=open_play&format=doubles&skillMin=3.0&skillMax=4.0&status=open
GET /api/v1/courts?surface=concrete&environment=outdoor&access=public&hasLighting=true
```

---

## 10. Infrastructure & DevOps

### 10.1 Local Development

```yaml
# docker-compose.yml
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: oldpickleball

  api:
    build: ./apps/api
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - mongodb
    volumes:
      - ./apps/api/src:/app/src  # hot reload

volumes:
  mongo_data:
```

### 10.2 Environment Variables

```env
# .env.example
NODE_ENV=development
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/oldpickleball

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:4200

# Maps (choose one)
GOOGLE_MAPS_API_KEY=
MAPBOX_ACCESS_TOKEN=

# Stripe (Phase 3)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Phase 1)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@oldpickleball.com
```

### 10.3 Dev Scripts

```jsonc
// Root package.json scripts
{
  "scripts": {
    "dev": "pnpm --parallel -r run dev",
    "dev:api": "pnpm --filter api dev",
    "dev:web": "pnpm --filter web dev",
    "dev:landing": "pnpm --filter landing dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "test": "pnpm -r run test",
    "db:seed": "pnpm --filter api run seed",
    "clean": "pnpm -r run clean"
  }
}
```

### 10.4 CI/CD Pipeline (GitHub Actions)

```
on push/PR:
  1. Install deps (pnpm install)
  2. Lint all packages
  3. Run unit + integration tests
  4. Build all apps
  5. (on main) Deploy:
     - API → Railway / Fly.io / AWS ECS
     - Web → Vercel / Firebase Hosting
     - Landing → Vercel
     - MongoDB → Atlas
```

### 10.5 Deployment Targets (Recommended)

| Service | Platform | Reason |
|---|---|---|
| MongoDB | MongoDB Atlas (free tier M0) | Managed, geo-distributed, free start |
| Koa API | Railway or Fly.io | Easy deploy, WebSocket support, cheap |
| Angular App | Vercel or Firebase Hosting | Static/SSR hosting, CDN |
| Landing (Next.js) | Vercel | Native Next.js support, edge functions |
| File Storage | AWS S3 or Cloudflare R2 | Court photos, avatars |

---

## Appendix: Key Design Decisions

| Decision | Rationale |
|---|---|
| **pnpm workspaces** over Nx | Simpler for 3-app monorepo; no Nx learning curve |
| **Koa over Express** | Lighter, async/await native, better middleware composition |
| **Mongoose over native driver** | Schema validation, population, middleware hooks — better DX |
| **Angular standalone components** | Modern Angular pattern, no NgModules overhead |
| **JWT in memory (not localStorage)** | XSS-safe; refresh token in HttpOnly cookie for security |
| **Socket.IO over raw WS** | Reconnection, rooms, namespaces, fallback transport |
| **Community-editable courts** | Crowdsourced accuracy (Pickleheads model) — builds engagement |
| **Skill range on sessions** | Solves mismatched games — #1 player complaint |
| **Separate landing from app** | SEO-optimized Next.js marketing site vs Angular SPA |
