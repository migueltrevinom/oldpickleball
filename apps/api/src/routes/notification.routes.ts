import Router from '@koa/router';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = new Router({ prefix: '/notifications' });

router.get('/', authenticate, NotificationController.list);
router.patch('/:id/read', authenticate, NotificationController.markAsRead);
router.post('/read-all', authenticate, NotificationController.markAllRead);
router.get('/unread-count', authenticate, NotificationController.unreadCount);

export default router;
