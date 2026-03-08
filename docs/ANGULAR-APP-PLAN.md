# OldPickleball — Angular App Architecture Plan

## 1. Role & Permission System

### Four User Roles (Separate Collections)

| Role | Collection | Description |
|---|---|---|
| **SuperAdmin** | `superadmins` | Platform operators. Full system access, analytics, user management. |
| **CourtAdmin** | `courtadmins` | Court/venue owners. Manage their courts, sessions, bookings, staff. |
| **CourtStaff** | `courtstaff` | Court employees. Limited admin (check-in, view bookings, manage sessions). |
| **User** | `users` | Players. Find courts, book slots, RSVP, join games, rate. |

### Permission Matrix

| Action | SuperAdmin | CourtAdmin | CourtStaff | User |
|---|---|---|---|---|
| View platform analytics | ✅ | ❌ | ❌ | ❌ |
| Manage all users | ✅ | ❌ | ❌ | ❌ |
| Manage all courts | ✅ | Own courts | Assigned courts | ❌ |
| Create/edit courts | ✅ | ✅ | ❌ | Submit (community) |
| Manage sessions | ✅ | Own courts | Assigned courts | Own sessions |
| View bookings calendar | ✅ | Own courts | Assigned courts | Own bookings |
| Manage staff | ✅ | ✅ | ❌ | ❌ |
| Check-in players | ✅ | ✅ | ✅ | ❌ |
| RSVP / Book slots | ✅ | ✅ | ✅ | ✅ |
| Rate players | ✅ | ✅ | ✅ | ✅ |

### Auth Flow (OTP → Role Detection → Dashboard)

```
1. User enters email on landing /go-play
2. API sends OTP via Mailgun
3. User verifies OTP → JWT issued with { sub, email, role, roleModel }
4. Angular receives token → checks role → redirects:
   - SuperAdmin → /admin/dashboard
   - CourtAdmin → /court/dashboard
   - CourtStaff → /court/dashboard (limited)
   - User → /dashboard (player dashboard)
5. If !isOnboarded → redirect to /onboarding
```

## 2. Backend API Changes

### New Mongoose Models

```
SuperAdmin { email, profile, permissions, isActive }
CourtAdmin { email, profile, courts: [Court], staff: [CourtStaff], isActive }
CourtStaff { email, profile, courtAdmin: CourtAdmin, assignedCourts: [Court], permissions, isActive }
```

`User` model stays as-is (already built).

### New API Routes

```
/api/v1/admin/*           # SuperAdmin only
/api/v1/court-admin/*     # CourtAdmin + SuperAdmin
/api/v1/staff/*           # CourtStaff + CourtAdmin + SuperAdmin
/api/v1/*                 # User routes (existing)
```

### Updated JWT Payload

```json
{
  "sub": "userId",
  "email": "user@example.com",
  "role": "super_admin | court_admin | court_staff | player",
  "roleModel": "SuperAdmin | CourtAdmin | CourtStaff | User",
  "iat": ...,
  "exp": ...
}
```

## 3. Angular App Architecture

### Design System

- **Tailwind CSS** for utility classes
- **shadcn/ui-inspired** components (custom Angular versions)
  - Clean, minimal, consistent borders/shadows
  - Calendly-style calendar views
- **Lucide icons** (Angular wrapper)
- **Font**: Inter (body) + Space Grotesk (headings)
- **Colors**: Green primary (#22c55e), warm peach accents, white bg

### Layout Pattern (Calendly-inspired)

```
┌──────────────────────────────────────────────────────┐
│  Header: Logo | Search | Notifications | Avatar      │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │    Main Content Area                      │
│          │                                           │
│ 🏠 Home  │    Dashboard / Page Content               │
│ 📅 Book  │                                           │
│ 🏓 Courts│                                           │
│ 👥 Games │                                           │
│ ⚙️ Set   │                                           │
│          │                                           │
├──────────┴───────────────────────────────────────────┤
│  (Mobile: Bottom tab bar instead of sidebar)          │
└──────────────────────────────────────────────────────┘
```

### Route Structure

```
/auth
  /auth/login              # Email input → OTP
  /auth/verify             # OTP verification
  /auth/onboarding         # Profile setup (new users)

/dashboard                 # Player (User) dashboard
  /dashboard/sessions      # My upcoming sessions
  /dashboard/bookings      # My court bookings
  /dashboard/history       # Past games

/courts                    # Court finder (map + list)
  /courts/:id              # Court detail
  /courts/:id/book         # Book a slot (calendar picker)

/sessions                  # Browse sessions
  /sessions/:id            # Session detail + RSVP
  /sessions/create         # Create new session

/profile                   # Edit profile
/settings                  # App settings

/court                     # CourtAdmin/Staff dashboard
  /court/dashboard         # Overview (today's bookings, stats)
  /court/calendar          # Full calendar view
  /court/courts            # Manage courts
  /court/sessions          # Manage sessions
  /court/staff             # Manage staff (admin only)
  /court/settings          # Court settings

/admin                     # SuperAdmin dashboard
  /admin/dashboard         # Platform overview (users, revenue, courts)
  /admin/users             # User management
  /admin/courts            # All courts
  /admin/analytics         # Charts + metrics
  /admin/settings          # Platform settings
```

### Dashboard Views by Role

**User Dashboard:**
- Welcome card with next upcoming session
- Quick actions: Find Court, Create Session, Browse Games
- Calendar strip (week view) showing my sessions
- Recent activity feed
- Nearby courts card

**CourtAdmin Dashboard:**
- Today's overview: bookings count, check-ins, revenue
- Calendar (day/week/month) with all court bookings
- Quick stats cards (utilization %, upcoming sessions, waitlisted)
- Staff activity log
- Recent bookings list

**SuperAdmin Dashboard:**
- Platform-wide metrics: total users, courts, sessions, revenue
- Growth charts (users/week, sessions/week)
- Recent signups list
- System health status
- Quick links to management sections

## 4. Component Library (shadcn-style)

```
ui/
├── button/          # Primary, secondary, outline, ghost, destructive
├── card/            # Card, CardHeader, CardContent, CardFooter
├── input/           # Text, email, search, with labels + errors
├── badge/           # Status badges (confirmed, waitlisted, cancelled)
├── avatar/          # User avatar with fallback initials
├── calendar/        # Date picker (Calendly-inspired)
├── dialog/          # Modal dialogs
├── dropdown/        # Dropdown menus
├── tabs/            # Tab navigation
├── table/           # Data tables with sorting
├── sidebar/         # Collapsible sidebar navigation
├── toast/           # Notification toasts
├── skeleton/        # Loading skeletons
└── separator/       # Horizontal/vertical dividers
```

## 5. Tech Stack

| Concern | Technology |
|---|---|
| Framework | Angular 17+ (standalone components) |
| Styling | Tailwind CSS 3.4 |
| State | Angular Signals + Services with BehaviorSubject |
| HTTP | HttpClient with interceptors |
| Routing | Angular Router with guards |
| Icons | lucide-angular |
| Calendar | Custom (inspired by Calendly) |
| Charts | Chart.js or ngx-charts (admin dashboard) |
| Forms | Reactive Forms |
