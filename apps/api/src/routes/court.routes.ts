import Router from '@koa/router';
import { CourtController } from '../controllers/court.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCourtSchema, updateCourtSchema } from '../validators/court.validator.js';

const router = new Router({ prefix: '/courts' });

router.get('/', optionalAuth, CourtController.list);
router.get('/:id', optionalAuth, CourtController.getById);
router.post('/', authenticate, validate({ body: createCourtSchema }), CourtController.create);
router.patch('/:id', authenticate, validate({ body: updateCourtSchema }), CourtController.update);
router.get('/:id/sessions', optionalAuth, CourtController.getSessions);
router.post('/:id/verify', authenticate, CourtController.verify);

export default router;
