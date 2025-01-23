"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const stripe = new stripe_1.default((_a = config_1.default.stripe) === null || _a === void 0 ? void 0 : _a.stripe_api_secret, {
    apiVersion: '2024-06-20',
    typescript: true,
});
const createCheckoutSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const paymentGatewayData = yield stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: (_a = payload === null || payload === void 0 ? void 0 : payload.product) === null || _a === void 0 ? void 0 : _a.name,
                    },
                    unit_amount: ((_b = payload.product) === null || _b === void 0 ? void 0 : _b.amount) * 100,
                },
                quantity: (_c = payload.product) === null || _c === void 0 ? void 0 : _c.quantity,
            },
        ],
        success_url: `${config_1.default.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${payload === null || payload === void 0 ? void 0 : payload.paymentId}`,
        cancel_url: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.cancel_url,
        // `${config.server_url}/payments/cancel?paymentId=${payload?.paymentId}`,
        mode: 'payment',
        // metadata: {
        //   user: JSON.stringify({
        //     paymentId: payment.id,
        //   }),
        // },
        invoice_creation: {
            enabled: true,
        },
        // customer: payload?.customerId,
        // payment_intent_data: {
        //   metadata: {
        //     payment: JSON.stringify({
        //       ...payment,
        //     }),
        //   },
        // },
        // payment_method_types: ['card', 'amazon_pay', 'cashapp', 'us_bank_account'],
        payment_method_types: ['card'],
    });
    return paymentGatewayData;
});
exports.createCheckoutSession = createCheckoutSession;
