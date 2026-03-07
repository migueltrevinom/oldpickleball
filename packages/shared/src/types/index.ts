import type {
  USER_ROLES, GAME_FORMATS, SESSION_TYPES, SESSION_STATUSES,
  RSVP_STATUSES, VISIBILITY_OPTIONS, PROFILE_VISIBILITY,
  SURFACE_TYPES, COURT_ENVIRONMENTS, ACCESS_TYPES, FEE_PERIODS,
  AMENITIES, CHAT_ROOM_TYPES, MESSAGE_TYPES, RATING_TAGS,
  NOTIFICATION_TYPES, NOTIFICATION_CHANNELS, EDIT_STATUSES
} from '../constants/index.js';

export type UserRole = typeof USER_ROLES[number];
export type GameFormat = typeof GAME_FORMATS[number];
export type SessionType = typeof SESSION_TYPES[number];
export type SessionStatus = typeof SESSION_STATUSES[number];
export type RsvpStatus = typeof RSVP_STATUSES[number];
export type Visibility = typeof VISIBILITY_OPTIONS[number];
export type ProfileVisibility = typeof PROFILE_VISIBILITY[number];
export type SurfaceType = typeof SURFACE_TYPES[number];
export type CourtEnvironment = typeof COURT_ENVIRONMENTS[number];
export type AccessType = typeof ACCESS_TYPES[number];
export type FeePeriod = typeof FEE_PERIODS[number];
export type Amenity = typeof AMENITIES[number];
export type ChatRoomType = typeof CHAT_ROOM_TYPES[number];
export type MessageType = typeof MESSAGE_TYPES[number];
export type RatingTag = typeof RATING_TAGS[number];
export type NotificationType = typeof NOTIFICATION_TYPES[number];
export type NotificationChannel = typeof NOTIFICATION_CHANNELS[number];
export type EditStatus = typeof EDIT_STATUSES[number];

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface ILocation extends GeoPoint {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: IPaginationMeta;
  error?: {
    message: string;
    code: string;
    details?: unknown[];
    stack?: string;
  };
}

export interface ITokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
