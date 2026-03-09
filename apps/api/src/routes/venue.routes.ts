import Router from '@koa/router';
import { VenueController } from '../controllers/venue.controller.js';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createVenueSchema, updateVenueSchema,
  addCourtSchema, updateCourtSchema,
} from '../validators/venue.validator.js';
import { createBookingSchema } from '../validators/booking.validator.js';

const router = new Router({ prefix: '/venues' });

// ── CourtAdmin: must appear before /:id to avoid param collision ────────
router.get('/mine', authenticate, requireRole('court_admin', 'super_admin'), VenueController.getMyVenues);
router.post(
  '/',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  validate({ body: createVenueSchema }),
  VenueController.createVenue,
);

// ── Open routes (browsing) ──────────────────────────────────────────────
router.get('/', optionalAuth, VenueController.searchVenues);
router.get('/:id', optionalAuth, VenueController.getVenueDetail);
router.get(
  '/:venueId/courts/:courtId/availability',
  optionalAuth,
  VenueController.getCourtAvailability,
);

// ── Protected: any authenticated user ───────────────────────────────────
router.post(
  '/:venueId/courts/:courtId/book',
  authenticate,
  validate({ body: createBookingSchema }),
  BookingController.createBooking,
);

// ── Protected: CourtAdmin ───────────────────────────────────────────────
router.patch(
  '/:id',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  validate({ body: updateVenueSchema }),
  VenueController.updateVenue,
);
router.post(
  '/:id/courts',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  validate({ body: addCourtSchema }),
  VenueController.addCourt,
);
router.patch(
  '/:venueId/courts/:courtId',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  validate({ body: updateCourtSchema }),
  VenueController.updateCourt,
);
router.delete(
  '/:venueId/courts/:courtId',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  VenueController.removeCourt,
);
router.get(
  '/:id/courts',
  optionalAuth,
  VenueController.getVenueCourts,
);
router.get(
  '/:id/bookings',
  authenticate,
  requireRole('court_admin', 'super_admin'),
  VenueController.getVenueBookings,
);

export default router;
