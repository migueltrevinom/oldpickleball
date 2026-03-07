import Router from '@koa/router';
import { SessionController } from '../controllers/session.controller.js';
import { RsvpController } from '../controllers/rsvp.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSessionSchema, updateSessionSchema } from '../validators/session.validator.js';

const router = new Router({ prefix: '/sessions' });

// ── Open routes (no auth required) ──────────────────────────────────────────
router.get('/', optionalAuth, SessionController.list);
router.get('/:id', optionalAuth, SessionController.getById);
router.get('/:id/rsvp', optionalAuth, RsvpController.list);

// ── Protected routes (auth required) ────────────────────────────────────────
router.post('/', authenticate, validate({ body: createSessionSchema }), SessionController.create);
router.patch('/:id', authenticate, validate({ body: updateSessionSchema }), SessionController.update);
router.delete('/:id', authenticate, SessionController.cancel);
router.post('/:id/rsvp', authenticate, RsvpController.join);
router.delete('/:id/rsvp', authenticate, RsvpController.cancel);

export default router;
