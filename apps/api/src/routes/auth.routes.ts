import Router from '@koa/router';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { requestOtpSchema, verifyOtpSchema, onboardSchema } from '../validators/auth.validator.js';

const router = new Router({ prefix: '/auth' });

// ── Open routes (no auth required) ──────────────────────────────────────────
router.post('/request-otp', validate({ body: requestOtpSchema }), AuthController.requestOtp);
router.post('/verify-otp', validate({ body: verifyOtpSchema }), AuthController.verifyOtp);
router.post('/refresh', AuthController.refresh);

// ── Protected routes (auth required) ────────────────────────────────────────
router.post('/onboard', authenticate, validate({ body: onboardSchema }), AuthController.onboard);
router.post('/logout', optionalAuth, AuthController.logout);

export default router;
