import Router from '@koa/router';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = new Router({ prefix: '/users' });

router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, validate({ body: updateProfileSchema }), UserController.updateMe);
router.get('/nearby', authenticate, UserController.getNearby);
router.get('/:id', authenticate, UserController.getById);

export default router;
