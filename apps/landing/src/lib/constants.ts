export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const METRICS = [
  { value: 12400, suffix: "+", label: "Players Active" },
  { value: 3200, suffix: "+", label: "Courts Listed" },
  { value: 45000, suffix: "+", label: "Games Played" },
  { value: 98, suffix: "%", label: "Show-Up Rate" },
] as const;

export const PAIN_POINTS = [
  {
    icon: "📍",
    title: "Find Courts Instantly",
    description: "No more googling. See every court near you with real-time availability, surface type, and amenities.",
  },
  {
    icon: "🎯",
    title: "Join Games By Skill",
    description: "Stop playing mismatched games. Filter by skill level and find players who match your intensity.",
  },
  {
    icon: "🚫",
    title: "No More No-Shows",
    description: "RSVP system with automatic waitlists, reminders, and reliability scores. Games that actually happen.",
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
    description: "Interactive map with filters for surface type, indoor/outdoor, lighting, skill level, and real-time availability. Community-verified accuracy.",
  },
  {
    icon: "🎯",
    title: "Smart Player Matching",
    description: "Auto-match by skill rating, location, preferred format, and schedule. Find your perfect doubles partner or singles rival.",
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
    quote: "OldPickleball got me playing three times a week. I used to struggle finding games — now they find me.",
    name: "Sarah K.",
    location: "Philadelphia, PA",
    skill: "3.5",
  },
  {
    quote: "The RSVP system is a game-changer. No more showing up to an empty court because everyone flaked.",
    name: "Marcus T.",
    location: "Cherry Hill, NJ",
    skill: "4.0",
  },
  {
    quote: "I moved to a new city and found my pickleball community in one week. This app is essential.",
    name: "Jennifer L.",
    location: "Austin, TX",
    skill: "3.0",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start playing.",
    features: [
      "Find courts near you",
      "Join sessions & RSVP",
      "Group chat per session",
      "Player ratings & profiles",
      "Push notifications",
      "Unlimited games",
    ],
    cta: "Go Play",
    ctaHref: "/go-play",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/ month",
    description: "For dedicated players who want more.",
    features: [
      "Everything in Free, plus:",
      "Priority matchmaking",
      "Advanced performance stats",
      "Ad-free experience",
      "Pro player badge",
      "Early access to features",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    highlighted: true,
  },
] as const;

export const FAQ = [
  {
    question: "Is OldPickleball really free?",
    answer: "Yes! The core features — finding courts, joining games, RSVP, chat, and ratings — are completely free. We offer a Pro plan for advanced features, but you can play forever without paying.",
  },
  {
    question: "Do I need to download an app?",
    answer: "OldPickleball works in your browser — no download required. We're building native apps for iOS and Android that will be available soon.",
  },
  {
    question: "How does skill matching work?",
    answer: "You set your self-rated skill level (1.0–5.5 scale) during signup. Sessions have skill ranges, so you'll only see games that match your level. We also support DUPR rating integration.",
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
