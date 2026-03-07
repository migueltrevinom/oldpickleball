export const SKILL_LEVELS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5] as const;
export const SKILL_MIN = 1.0;
export const SKILL_MAX = 5.5;

export const USER_ROLES = ['player', 'coach', 'venue_owner', 'admin'] as const;
export const GAME_FORMATS = ['singles', 'doubles', 'mixed', 'any'] as const;
export const SESSION_TYPES = ['open_play', 'round_robin', 'ladder', 'casual', 'drill', 'lesson', 'tournament'] as const;
export const SESSION_STATUSES = ['draft', 'open', 'full', 'in_progress', 'completed', 'cancelled'] as const;
export const RSVP_STATUSES = ['confirmed', 'waitlisted', 'cancelled', 'no_show'] as const;
export const VISIBILITY_OPTIONS = ['public', 'friends', 'invite_only'] as const;
export const PROFILE_VISIBILITY = ['public', 'friends', 'private'] as const;

export const SURFACE_TYPES = ['concrete', 'asphalt', 'wood', 'sport_court', 'other'] as const;
export const COURT_ENVIRONMENTS = ['indoor', 'outdoor', 'covered'] as const;
export const ACCESS_TYPES = ['public', 'private', 'semi_private', 'membership'] as const;
export const FEE_PERIODS = ['hour', 'session', 'day', 'month'] as const;
export const AMENITIES = ['restrooms', 'water', 'parking', 'pro_shop', 'seating', 'food', 'lockers', 'wheelchair_accessible'] as const;

export const CHAT_ROOM_TYPES = ['session', 'direct', 'group', 'court'] as const;
export const MESSAGE_TYPES = ['text', 'image', 'system'] as const;

export const RATING_TAGS = ['reliable', 'fun', 'competitive', 'good_sport', 'punctual', 'skilled', 'great_partner'] as const;

export const NOTIFICATION_TYPES = [
  'session_invite', 'session_reminder', 'rsvp_update',
  'waitlist_promoted', 'new_session_nearby', 'friend_request',
  'chat_message', 'rating_received', 'system'
] as const;
export const NOTIFICATION_CHANNELS = ['push', 'email', 'in_app'] as const;

export const EDIT_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const MILES_TO_METERS = 1609.34;
export const DEFAULT_SEARCH_RADIUS_MILES = 25;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;
