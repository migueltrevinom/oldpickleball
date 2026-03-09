import Router from '@koa/router';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import courtRoutes from './court.routes.js';
import sessionRoutes from './session.routes.js';
import notificationRoutes from './notification.routes.js';
import venueRoutes from './venue.routes.js';
import bookingRoutes from './booking.routes.js';

const apiRouter = new Router({ prefix: '/api/v1' });

apiRouter.use(authRoutes.routes(), authRoutes.allowedMethods());
apiRouter.use(userRoutes.routes(), userRoutes.allowedMethods());
apiRouter.use(courtRoutes.routes(), courtRoutes.allowedMethods());
apiRouter.use(sessionRoutes.routes(), sessionRoutes.allowedMethods());
apiRouter.use(notificationRoutes.routes(), notificationRoutes.allowedMethods());
apiRouter.use(venueRoutes.routes(), venueRoutes.allowedMethods());
apiRouter.use(bookingRoutes.routes(), bookingRoutes.allowedMethods());

export default apiRouter;
