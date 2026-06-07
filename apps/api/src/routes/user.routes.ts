import Router from '@koa/router';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileSchema,
  changeEmailSchema,
  verifyEmailChangeSchema,
} from '../validators/user.validator.js';

const router = new Router({ prefix: '/users' });

// ── All user routes are protected ───────────────────────────────────────────

// Profile
router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, validate({ body: updateProfileSchema }), UserController.updateMe);

// Email change (2-step OTP verification)
router.post('/me/change-email', authenticate, validate({ body: changeEmailSchema }), UserController.changeEmail);
router.post('/me/verify-email', authenticate, validate({ body: verifyEmailChangeSchema }), UserController.verifyEmailChange);

// Discovery
router.get('/nearby', authenticate, UserController.getNearby);
router.get('/:id', authenticate, UserController.getById);

export default router;
