"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const notificaiton_route_1 = require("../modules/notification/notificaiton.route");
const cars_route_1 = require("../modules/cars/cars.route");
const packages_route_1 = require("../modules/packages/packages.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const payments_route_1 = require("../modules/payments/payments.route");
const contact_route_1 = require("../modules/contact/contact.route");
const dealerContact_route_1 = require("../modules/dealerContact/dealerContact.route");
const traffic_route_1 = require("../modules/traffic/traffic.route");
const brands_route_1 = require("../modules/brands/brands.route");
const models_route_1 = require("../modules/models/models.route");
const invoice_route_1 = require("../modules/invoice/invoice.route");
const most_wanted_route_1 = require("../modules/most_wanted/most_wanted.route");
const privacy_route_1 = require("../modules/privacy/privacy.route");
const about_route_1 = require("../modules/about/about.route");
const terms_route_1 = require("../modules/terms/terms.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/cars',
        route: cars_route_1.carsRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/otp',
        route: otp_routes_1.otpRoutes,
    },
    {
        path: '/notifications',
        route: notificaiton_route_1.notificationRoutes,
    },
    {
        path: '/packages',
        route: packages_route_1.packagesRoutes,
    },
    {
        path: '/subscriptions',
        route: subscription_route_1.subscriptionRoutes,
    },
    {
        path: '/payments',
        route: payments_route_1.paymentsRoutes,
    },
    {
        path: '/contact',
        route: contact_route_1.contactRoutes,
    },
    {
        path: '/dealercontact',
        route: dealerContact_route_1.dealerContactRoutes,
    },
    {
        path: '/traffic',
        route: traffic_route_1.trafficRoutes,
    },
    {
        path: '/brands',
        route: brands_route_1.brandsRoutes,
    },
    {
        path: '/models',
        route: models_route_1.modelsRoutes,
    },
    {
        path: '/invoices',
        route: invoice_route_1.invoiceRoutes,
    },
    {
        path: '/mostwanted',
        route: most_wanted_route_1.most_wantedRoutes,
    },
    {
        path: '/privacy',
        route: privacy_route_1.privacyRoutes,
    },
    {
        path: '/about',
        route: about_route_1.aboutRoutes,
    },
    {
        path: '/terms',
        route: terms_route_1.termsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
