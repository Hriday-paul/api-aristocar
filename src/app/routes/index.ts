import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { carsRoutes } from '../modules/cars/cars.route';
import { packagesRoutes } from '../modules/packages/packages.route';
import { subscriptionRoutes } from '../modules/subscription/subscription.route';
import { paymentsRoutes } from '../modules/payments/payments.route';
import { contactRoutes } from '../modules/contact/contact.route';
import { dealerContactRoutes } from '../modules/dealerContact/dealerContact.route';
import { trafficRoutes } from '../modules/traffic/traffic.route';
import { brandsRoutes } from '../modules/brands/brands.route';
import { modelsRoutes } from '../modules/models/models.route';
import { invoiceRoutes } from '../modules/invoice/invoice.route';
import { most_wantedRoutes } from '../modules/most_wanted/most_wanted.route';
import { privacyRoutes } from '../modules/privacy/privacy.route';
import { aboutRoutes } from '../modules/about/about.route';
import { termsRoutes } from '../modules/terms/terms.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/cars',
    route: carsRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/packages',
    route: packagesRoutes,
  },
  {
    path: '/subscriptions',
    route: subscriptionRoutes,
  },
  {
    path: '/payments',
    route: paymentsRoutes,
  },
  {
    path: '/contact',
    route: contactRoutes,
  },
  {
    path: '/dealercontact',
    route: dealerContactRoutes,
  },
  {
    path: '/traffic',
    route: trafficRoutes,
  },
  {
    path: '/brands',
    route: brandsRoutes,
  },
  {
    path: '/models',
    route: modelsRoutes,
  },
  {
    path: '/invoices',
    route: invoiceRoutes,
  },
  {
    path: '/mostwanted',
    route: most_wantedRoutes,
  },
  {
    path: '/privacy',
    route: privacyRoutes,
  },
  {
    path: '/about',
    route: aboutRoutes,
  },
  {
    path: '/terms',
    route: termsRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
