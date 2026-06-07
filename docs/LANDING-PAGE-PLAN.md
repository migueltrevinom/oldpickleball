# OldPickleball — Landing Page Plan

> Expressive 3D visuals, bold typography, trust-building design, frictionless CTAs.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [3D Visual Strategy](#3-3d-visual-strategy)
4. [Page-by-Page Blueprint](#4-page-by-page-blueprint)
5. [Component Architecture](#5-component-architecture)
6. [Animation & Interaction Plan](#6-animation--interaction-plan)
7. [Tech Stack](#7-tech-stack)
8. [Performance Strategy](#8-performance-strategy)

---

## 1. Design Philosophy

### Core Principles

| Principle | How |
|---|---|
| **"You're in the right place"** | 3D court hero immediately signals pickleball. No guessing. |
| **Scientific character** | Inter/Space Grotesk type, data-driven design, metric-style callouts |
| **Minimal complexity** | White space as a feature. One idea per viewport section. |
| **Action-first UX** | Every section ends with a CTA. "Go Play" is always visible. |
| **Progressive disclosure** | Hero → value props → features → social proof → pricing → CTA |

### Emotional Arc

```
Landing → "Wow, this looks incredible" (3D court, balls in motion)
  → "This solves MY problem" (value props with relatable pain points)
    → "Look at everything it does" (feature showcase with micro-interactions)
      → "Real people use this" (testimonials, stats, trust)
        → "It's affordable / free" (pricing transparency)
          → "Let me in!" (Go Play — sign up CTA)
```

---

## 2. Design System

### Color Palette

```
Primary Green     #22c55e  (Pickleball energy, CTAs, accents)
Primary Dark      #15803d  (Hover states, emphasis)
Court Blue        #1e3a5f  (Court surface tone, trust, depth)
Dark Background   #0a0f1a  (Hero section, premium feel)
Surface White     #ffffff  (Cards, content areas)
Surface Light     #f8fafc  (Alternating section backgrounds)
Text Primary      #0f172a  (Headings, body)
Text Secondary    #64748b  (Captions, muted)
Text Muted        #94a3b8  (Labels, metadata)
Accent Yellow     #facc15  (Ball color, highlights, badges)
Accent Orange     #f97316  (Urgency, secondary CTA)
```

### Typography

```
Headings:    Space Grotesk  (Bold/ExtraBold, scientific character)
Body:        Inter          (Regular/Medium, supreme readability)
Monospace:   JetBrains Mono (Stats, data, metric callouts)

Scale (desktop):
  Hero H1:     72px / 76px line-height / -2px tracking
  Section H2:  48px / 52px / -1px tracking
  H3:          32px / 38px / -0.5px tracking
  H4:          24px / 30px
  Body Large:  18px / 28px
  Body:        16px / 26px
  Caption:     14px / 22px
  Overline:    12px / 16px / 2px tracking / uppercase

Mobile scale: ~70% of desktop sizes
```

### Spacing & Grid

```
Container:     max-w-7xl (1280px) centered
Section pad:   py-24 (96px) desktop, py-16 mobile
Card radius:   16px (large), 12px (medium), 8px (small)
Gap system:    4, 8, 12, 16, 24, 32, 48, 64, 96
```

### Visual Elements

- **Glassmorphism** cards over the 3D scene (frosted glass with backdrop-blur)
- **Gradient borders** on feature cards (green → blue)
- **Dot grid** subtle background pattern in light sections
- **Metric callouts** styled like a scoreboard (monospace, green accent)

---

## 3. 3D Visual Strategy

### Technology

```
React Three Fiber (R3F)    — React renderer for Three.js
@react-three/drei          — Helpers (OrbitControls, Text, Environment)
@react-three/postprocessing — Bloom, depth of field
```

### Hero Scene: "The Court"

A stylized 3D pickleball court viewed from a dramatic camera angle with animated balls.

```
Camera: Elevated perspective (30° angle), slight orbit drift
Scene:
  ┌─────────────────────────────────────┐
  │            PICKLEBALL COURT          │
  │  ┌─────────┐    net    ┌─────────┐  │
  │  │  kitchen │ ┃┃┃┃┃┃┃  │ kitchen │  │
  │  │         │ ┃┃┃┃┃┃┃  │         │  │
  │  └─────────┘          └─────────┘  │
  │                                     │
  └─────────────────────────────────────┘

Animated elements:
  🟡 Ball 1 — Dink arc (low, soft, kitchen-to-kitchen)
  🟡 Ball 2 — Drop shot arc (high → soft landing)
  🟡 Ball 3 — Fast drive (flat trajectory across court)

Balls loop with staggered timing for continuous motion.
Subtle shadows on court surface.
```

### Court Design (Programmatic Geometry)

- Court surface: **Flat plane** with painted lines (texture or geometry)
- Color scheme: Blue court (like real pickleball), white lines, green surroundings
- Net: Thin mesh or line geometry with slight sag
- Ground plane: Subtle dark gradient (fades to hero background)
- Lighting: Soft ambient + directional (simulating outdoor sun), subtle bloom

### Ball Animation

Each ball follows a parametric arc:

```
Position(t) = {
  x: lerp(startX, endX, t),
  y: arcHeight * sin(π * t),   // parabolic arc
  z: lerp(startZ, endZ, t),
}
```

Three ball types with different trajectories:
1. **Dink**: Low arc (peak ~0.3m), short distance, slow
2. **Drop shot**: Higher arc (peak ~1.5m), medium distance, medium speed
3. **Drive**: Minimal arc (peak ~0.1m), full court, fast

Balls have:
- Yellow color with subtle glow (emissive material)
- Small bounce on landing (secondary animation)
- Fading trail/afterglow effect (postprocessing bloom)

### Scroll-Linked Behavior

As user scrolls past hero:
- Camera slowly pulls back and tilts
- Court fades to background with parallax
- Content sections slide in on top

### Fallback (Mobile / Low-Power)

- Static hero image of the 3D court (pre-rendered)
- Or simplified 2D animation with CSS (bouncing ball SVGs)
- Detect via `navigator.hardwareConcurrency` and `matchMedia('(prefers-reduced-motion)')

---

## 4. Page-by-Page Blueprint

### Navigation Bar

```
┌──────────────────────────────────────────────────────────┐
│ 🏓 OldPickleball     Home  Features  About  Pricing     │
│                                          [Go Play →]     │
└──────────────────────────────────────────────────────────┘
```

- **Fixed/sticky** with blur backdrop on scroll
- Logo left, links center, CTA right
- Mobile: hamburger menu with slide-in drawer
- "Go Play" button is **always visible** — green, pill-shaped, prominent

---

### HOME PAGE

#### Section 1: Hero (Full Viewport)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              [3D Pickleball Court Scene]                  │
│           Balls bouncing, dinking, dropping               │
│                                                          │
│     ┌──────────────────────────────────────────┐         │
│     │  Find Your Court.                        │         │
│     │  Join the Game.                          │         │
│     │  Play More Pickleball.                   │         │
│     │                                          │         │
│     │  The app that connects players,          │         │
│     │  fills courts, and kills no-shows.       │         │
│     │                                          │         │
│     │  [Go Play — It's Free →]  [See How ↓]   │         │
│     └──────────────────────────────────────────┘         │
│                                                          │
│                    ↓ scroll indicator                     │
└──────────────────────────────────────────────────────────┘
```

- **Headline**: Space Grotesk, 72px, white, multi-line with green accent on "Game"
- **Subhead**: Inter, 18px, muted white
- **CTA**: Green pill button "Go Play — It's Free" + ghost "See How" link
- Text overlays the 3D scene with glassmorphism panel

#### Section 2: Pain → Solution (3 Cards)

```
OVERLINE: "Why players love us"
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 📍           │  │ 🎯           │  │ 🚫           │  │
│  │ Find Courts  │  │ Join Games   │  │ No More      │  │
│  │ Instantly    │  │ By Skill     │  │ No-Shows     │  │
│  │              │  │              │  │              │  │
│  │ "Where can   │  │ Stop playing │  │ RSVP +       │  │
│  │ I play       │  │ mismatched   │  │ waitlist +   │  │
│  │ right now?"  │  │ games.       │  │ reminders.   │  │
│  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- White cards on light gray background
- Large emoji/icon top, bold title, relatable pain-point copy
- Animate in on scroll (stagger left to right)

#### Section 3: Live Metrics (Social Proof Scoreboard)

```
┌──────────────────────────────────────────────────────────┐
│              Dark background (court blue)                  │
│                                                          │
│     12,400+        3,200+        45,000+       98%       │
│     Players        Courts        Games         Show-Up   │
│     Active         Listed        Played        Rate      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- JetBrains Mono numbers, animated count-up on scroll
- Green accent bar under each number
- These can be placeholder numbers initially — update with real metrics later

#### Section 4: How It Works (3 Steps)

```
OVERLINE: "Start playing in 60 seconds"
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    ① Sign Up           ② Find & Join        ③ Play!     │
│    Enter your email.   Browse courts &      Show up,    │
│    Verify with a       sessions near you.   play, rate  │
│    one-time code.      RSVP in one tap.     your match. │
│                                                          │
│    [mockup/icon]       [mockup/icon]        [mockup/icon]│
│                                                          │
│                   [Go Play →]                            │
└──────────────────────────────────────────────────────────┘
```

- Numbered steps with dotted connecting line
- Each step has a minimal illustration or icon
- Green "Go Play" CTA at bottom

#### Section 5: Feature Preview (Scrolling Cards)

```
OVERLINE: "Everything you need to play more"
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌─────────────────────────────────────────────────┐     │
│  │ [Screenshot / mockup]    Real-Time Court Finder  │     │
│  │                          Map view with filters   │     │
│  │                          for skill, surface,     │     │
│  │                          availability.           │     │
│  └─────────────────────────────────────────────────┘     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐     │
│  │ Smart RSVP +            [Screenshot / mockup]   │     │
│  │ Waitlist                                        │     │
│  │ Join, waitlist,                                 │     │
│  │ auto-promote.                                   │     │
│  └─────────────────────────────────────────────────┘     │
│                                                          │
│                 [See All Features →]                      │
└──────────────────────────────────────────────────────────┘
```

- Alternating image/text layout (zigzag)
- Show 2-3 key features, link to Features page for full list
- Subtle parallax on mockup images

#### Section 6: Testimonials

```
┌──────────────────────────────────────────────────────────┐
│              "OldPickleball got me playing                │
│               three times a week."                        │
│                                                          │
│              — Sarah K., Philadelphia                     │
│              ⭐⭐⭐⭐⭐  Skill: 3.5                      │
│                                                          │
│              ← [dots] →                                   │
└──────────────────────────────────────────────────────────┘
```

- Carousel with auto-play, pause on hover
- Large quote, player name, location, rating
- Light background with subtle card

#### Section 7: Final CTA (Full Width)

```
┌──────────────────────────────────────────────────────────┐
│         Dark gradient background (green → court blue)     │
│                                                          │
│          Ready to find your next game?                    │
│                                                          │
│          [Go Play — It's Free →]                         │
│                                                          │
│          No credit card. No downloads. Just play.         │
└──────────────────────────────────────────────────────────┘
```

#### Footer

```
┌──────────────────────────────────────────────────────────┐
│  🏓 OldPickleball                                        │
│                                                          │
│  Product         Company        Legal                     │
│  Features        About Us       Privacy Policy            │
│  Pricing         Contact        Terms of Service          │
│  Go Play         Careers                                  │
│                                                          │
│  © 2026 OldPickleball. All rights reserved.              │
└──────────────────────────────────────────────────────────┘
```

---

### FEATURES PAGE

```
Hero: "Everything you need to play more pickleball"
Subhead: "From finding courts to organizing games — all in one app."

Feature Grid (6 features, 2 columns):

┌──────────────────┐  ┌──────────────────┐
│ 📍 Court Finder  │  │ 🎯 Smart Match   │
│ Real-time map    │  │ Play with your   │
│ with filters     │  │ skill level      │
└──────────────────┘  └──────────────────┘
┌──────────────────┐  ┌──────────────────┐
│ 📋 RSVP System   │  │ 💬 Group Chat    │
│ Join, waitlist,  │  │ Coordinate per   │
│ auto-promote     │  │ session          │
└──────────────────┘  └──────────────────┘
┌──────────────────┐  ┌──────────────────┐
│ ⭐ Player Ratings │  │ 🔔 Alerts        │
│ Build trust with │  │ New games near   │
│ post-game reviews│  │ you, reminders   │
└──────────────────┘  └──────────────────┘

Bottom CTA: [Go Play →]
```

Each card has: icon, title, 2-line description, subtle hover effect (lift + shadow).

---

### ABOUT US PAGE

```
Hero: "We're on a mission to fill every court"
Visual: Team photo or illustrated characters on a court

Story section:
  "We built OldPickleball because we were tired of
   WhatsApp chaos, no-shows, and empty courts.
   [More copy about the founding story]"

Values (3 columns):
  Community First | Player-Driven | Always Improving

Team section (optional — can add later):
  Founder cards with photo, name, role, fun pickleball fact

Bottom CTA: [Join the Community →]
```

---

### PRICING PAGE

```
Hero: "Simple pricing. No surprises."

┌────────────────────┐  ┌────────────────────┐
│   FREE             │  │   PRO              │
│   $0 / forever     │  │   $9.99 / month    │
│                    │  │                    │
│   ✅ Find courts   │  │   ✅ Everything in  │
│   ✅ Join sessions  │  │      Free, plus:   │
│   ✅ RSVP & chat   │  │   ✅ Priority match │
│   ✅ Player ratings │  │   ✅ Advanced stats │
│   ✅ Notifications  │  │   ✅ Ad-free        │
│                    │  │   ✅ Badge          │
│   [Go Play →]      │  │   [Coming Soon]    │
└────────────────────┘  └────────────────────┘

FAQ accordion below pricing cards
```

---

### GO PLAY PAGE

This is the **conversion page** — should feel like a launchpad.

```
Hero: "Let's get you on the court"
Subhead: "Enter your email to start playing in 60 seconds."

┌──────────────────────────────────────┐
│                                      │
│   [Email input field]                │
│   [Send Verification Code →]        │
│                                      │
│   ✓ No password needed              │
│   ✓ Free forever                     │
│   ✓ Takes 60 seconds                │
│                                      │
└──────────────────────────────────────┘

After email → show OTP input → redirect to app

OR: If the Angular app is ready → redirect to the app sign-up
For MVP: Simple email capture form that hits the API
```

---

## 5. Component Architecture

```
landing/src/
├── app/
│   ├── layout.tsx           # Root layout (nav + footer)
│   ├── page.tsx             # Home
│   ├── features/page.tsx
│   ├── about/page.tsx
│   ├── pricing/page.tsx
│   └── go-play/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Sticky nav with blur
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx   # Slide-in drawer
│   │
│   ├── three/               # 3D components (client-only)
│   │   ├── CourtScene.tsx   # Main 3D scene wrapper
│   │   ├── Court.tsx        # Court geometry + lines + net
│   │   ├── Ball.tsx         # Animated ball with trail
│   │   └── Lighting.tsx     # Scene lighting setup
│   │
│   ├── sections/            # Home page sections
│   │   ├── Hero.tsx         # 3D scene + headline + CTA
│   │   ├── PainPoints.tsx   # 3-card value props
│   │   ├── Metrics.tsx      # Animated counter scoreboard
│   │   ├── HowItWorks.tsx   # 3-step guide
│   │   ├── FeaturePreview.tsx # Zigzag feature cards
│   │   ├── Testimonials.tsx # Quote carousel
│   │   └── FinalCTA.tsx     # Full-width closing CTA
│   │
│   ├── ui/                  # Reusable UI primitives
│   │   ├── Button.tsx       # Primary, secondary, ghost variants
│   │   ├── Card.tsx         # Standard card with hover
│   │   ├── Badge.tsx        # Small labels
│   │   ├── Counter.tsx      # Animated number count-up
│   │   ├── Container.tsx    # Max-width wrapper
│   │   └── SectionHeader.tsx # Overline + H2 + subtitle
│   │
│   └── forms/
│       └── EmailCapture.tsx # Email input + OTP flow
│
├── lib/
│   ├── constants.ts         # Feature lists, testimonials, pricing, etc.
│   └── utils.ts             # Helpers
│
└── styles/
    └── globals.css          # Tailwind base + custom properties
```

---

## 6. Animation & Interaction Plan

### Scroll Animations (Framer Motion)

| Element | Trigger | Animation |
|---|---|---|
| Section headings | Enter viewport | Fade up + slide from bottom (y: 30→0) |
| Cards | Enter viewport | Stagger fade-in (0.1s delay per card) |
| Metrics numbers | Enter viewport | Count-up from 0 to target (2s duration) |
| Feature images | Enter viewport | Parallax (slight vertical offset) |
| Testimonials | Auto + manual | Crossfade carousel (5s interval) |

### 3D Scene Interactions

| Interaction | Effect |
|---|---|
| Page load | Camera slowly orbits the court (auto-rotate) |
| Mouse move (desktop) | Subtle camera tilt toward cursor (parallax) |
| Scroll past hero | Camera pulls back, court shrinks, fades |
| Click ball | Fun easter egg — ball changes color/speed |

### Micro-interactions

- **Buttons**: Scale 1.02 on hover, green glow shadow
- **Cards**: translateY(-4px) + box-shadow increase on hover
- **Nav links**: Underline animation (left → right width grow)
- **"Go Play" button**: Subtle pulse animation when idle (attention)

---

## 7. Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, SSR/SSG) |
| Styling | Tailwind CSS 3.4+ |
| 3D | React Three Fiber + @react-three/drei |
| Animation | Framer Motion (scroll + layout) |
| Typography | Google Fonts: Space Grotesk + Inter |
| Icons | Lucide React |
| Forms | React Hook Form (Go Play email capture) |
| Analytics | (future) PostHog or Plausible |

### Dependencies

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "@react-three/fiber": "^8",
    "@react-three/drei": "^9",
    "three": "^0.170",
    "framer-motion": "^11",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "tailwindcss": "^3.4",
    "postcss": "^8",
    "autoprefixer": "^10",
    "typescript": "^5",
    "@types/three": "^0.170",
    "@types/react": "^18"
  }
}
```

---

## 8. Performance Strategy

| Technique | Application |
|---|---|
| **Dynamic import** | 3D scene loaded with `next/dynamic` (no SSR) |
| **Suspense fallback** | Static court image while 3D loads |
| **Image optimization** | Next.js `<Image>` for all static assets |
| **Font optimization** | `next/font` for Space Grotesk + Inter (no layout shift) |
| **Code splitting** | Each page is its own chunk (App Router default) |
| **Prefers-reduced-motion** | Skip 3D, use static hero for accessibility |
| **Lighthouse target** | 90+ Performance, 100 Accessibility |

### Critical Rendering Path

```
1. SSR shell (nav, hero text, CTA) → First paint in <1s
2. Hydration + Tailwind styles
3. Dynamic import 3D scene (non-blocking)
4. 3D scene renders → balls start animating
5. Scroll reveals trigger as user scrolls
```

This ensures the page is **usable immediately** even before 3D loads.
