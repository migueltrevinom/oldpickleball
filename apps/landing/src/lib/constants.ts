export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const LAUNCH_PROOF = [
  {
    eyebrow: "Now forming",
    title: "Founding player community",
    description:
      "Join the first group helping shape how local pickleball games get organized.",
  },
  {
    eyebrow: "Free early access",
    title: "No credit card. No password friction.",
    description:
      "Start with a simple player profile and help us build the play network from day one.",
  },
  {
    eyebrow: "Player-first roadmap",
    title: "Courts, RSVPs, waitlists, reminders",
    description:
      "The first version is focused on the boring coordination work that keeps games from happening.",
  },
  {
    eyebrow: "Launching locally first",
    title: "Built before the stats",
    description:
      "We are not showing fake numbers. Early players will help decide what matters before we scale.",
  },
] as const;

export const PAIN_POINTS = [
  {
    icon: "📍",
    title: "Find Courts Instantly",
    description: "No more scattered searches. Build a clean court map with locations, amenities, and play notes from people who actually go there.",
  },
  {
    icon: "🎯",
    title: "Join Games By Skill",
    description: "Stop guessing from group chats. Join sessions by skill level, format, and the kind of game you actually want.",
  },
  {
    icon: "🚫",
    title: "Cut Down No-Shows",
    description: "RSVPs, waitlists, reminders, and accountability tools designed to make planned games feel real.",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Sign Up",
    description: "Enter your email. Verify with a one-time code. No passwords, no friction.",
  },
  {
    number: "02",
    title: "Find & Join",
    description: "Browse courts and sessions near you. Filter by skill, format, and time. RSVP in one tap.",
  },
  {
    number: "03",
    title: "Play!",
    description: "Show up, play great pickleball, rate your experience. Build your community.",
  },
] as const;

export const FEATURES = [
  {
    icon: "📍",
    title: "Real-Time Court Finder",
    description: "Interactive map with filters for surface type, indoor/outdoor, lighting, and local play notes as the community grows.",
  },
  {
    icon: "🎯",
    title: "Smart Player Matching",
    description: "Match by skill rating, location, preferred format, and schedule so you can find better-fit games faster.",
  },
  {
    icon: "📋",
    title: "RSVP & Waitlist System",
    description: "One-tap join with automatic waitlist promotion when spots open. Reminders, cancellation handling, and reliability tracking.",
  },
  {
    icon: "💬",
    title: "Session Group Chat",
    description: "Per-game chat rooms to coordinate gear, arrivals, and last-minute changes. No more WhatsApp chaos.",
  },
  {
    icon: "⭐",
    title: "Player Ratings & Trust",
    description: "Post-game ratings for reliability, sportsmanship, and skill. Build a reputation that gets you into better games.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description: "Alerts for new sessions near you, open spots, friend invites, and game reminders. Never miss a chance to play.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote: "I just want to know where people are actually playing tonight.",
    label: "Player problem",
    detail: "Open play discovery",
  },
  {
    quote: "Group chats work until someone cancels and nobody knows who is next.",
    label: "Player problem",
    detail: "RSVP chaos",
  },
  {
    quote: "Open play schedules are scattered everywhere, and half of them are stale.",
    label: "Player problem",
    detail: "Court info",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start playing.",
    features: [
      "Founding player access",
      "Court discovery as it launches",
      "Session RSVP and waitlist tools",
      "Group chat per session",
      "Player profiles",
      "Early feedback channel",
    ],
    cta: "Go Play",
    ctaHref: "/go-play",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Later",
    period: "",
    description: "Planned tools for dedicated players once the free network is useful.",
    features: [
      "Everything in Free, plus:",
      "Priority feature requests",
      "Advanced player tools",
      "Organizer controls",
      "Deeper game history",
      "Built after player feedback",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    highlighted: true,
  },
] as const;

export const FAQ = [
  {
    question: "Is OldPickleball really free?",
    answer: "Yes. Early access is free for founding players. The goal is to make the core loop - finding courts, joining games, RSVPs, and chat - useful before introducing paid extras.",
  },
  {
    question: "Do I need to download an app?",
    answer: "OldPickleball works in your browser — no download required. We're building native apps for iOS and Android that will be available soon.",
  },
  {
    question: "How does skill matching work?",
    answer: "You set your self-rated skill level during signup. Sessions can use skill ranges so players can find games that match their level. Deeper rating integrations can come later if players ask for them.",
  },
  {
    question: "What if I need to cancel my RSVP?",
    answer: "You can cancel anytime. If there's a waitlist, the next player is automatically promoted. Frequent no-shows affect your reliability score, which encourages accountability.",
  },
  {
    question: "Can I organize my own sessions?",
    answer: "Absolutely! Create a session, set the skill range, time, location, and capacity. Share it with the community or invite friends directly.",
  },
] as const;
