import { MILES_TO_METERS } from '../constants/index.js';

export function milesToMeters(miles: number): number {
  return miles * MILES_TO_METERS;
}

export function metersToMiles(meters: number): number {
  return meters / MILES_TO_METERS;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function clampSkillLevel(level: number): number {
  return Math.max(1.0, Math.min(5.5, Math.round(level * 2) / 2));
}
