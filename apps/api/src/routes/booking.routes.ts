import Router from '@koa/router';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = new Router({ prefix: '/bookings' });

// ── Protected: any authenticated user ───────────────────────────────────
router.get('/mine', authenticate, BookingController.getMyBookings);
router.delete('/:id', authenticate, BookingController.cancelBooking);

export default router;
