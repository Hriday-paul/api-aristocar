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
exports.paymentsService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const subscription_models_1 = __importDefault(require("../subscription/subscription.models"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const payments_models_1 = __importDefault(require("./payments.models"));
const user_models_1 = require("../user/user.models");
const payments_utils_1 = require("./payments.utils");
const mongoose_1 = require("mongoose");
const notification_interface_1 = require("../notification/notification.interface");
const user_constants_1 = require("../user/user.constants");
const generateRandomString_1 = __importDefault(require("../../utils/generateRandomString"));
const moment_1 = __importDefault(require("moment"));
const notification_model_1 = require("../notification/notification.model");
const packages_models_1 = __importDefault(require("../packages/packages.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const invoice_models_1 = __importDefault(require("../invoice/invoice.models"));
const stripe = new stripe_1.default((_a = config_1.default.stripe) === null || _a === void 0 ? void 0 : _a.stripe_api_secret, {
    apiVersion: '2024-06-20',
    typescript: true,
});
const checkout = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tranId = (0, generateRandomString_1.default)(10);
    let paymentData;
    const subscription = yield subscription_models_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.subscription).populate('package');
    if (!subscription) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription Not Found!');
    }
    // Check for existing unpaid payment for the subscription
    const isExistPayment = yield payments_models_1.default.findOne({
        subscription: payload === null || payload === void 0 ? void 0 : payload.subscription,
        isPaid: false,
        user: payload === null || payload === void 0 ? void 0 : payload.user,
    });
    const user = yield user_models_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.user); // Assuming you have a User model
    let amount = subscription === null || subscription === void 0 ? void 0 : subscription.amount;
    let vat = 0;
    let vatParcentage = 0;
    console.log('vat type', user === null || user === void 0 ? void 0 : user.vat_type);
    if ((user === null || user === void 0 ? void 0 : user.vat_type) === 'Romanian') {
        const vatRate = 0.19; // 19% VAT
        const totalVat = (subscription === null || subscription === void 0 ? void 0 : subscription.amount) * vatRate;
        amount = totalVat + (subscription === null || subscription === void 0 ? void 0 : subscription.amount);
        vat = totalVat;
        vatParcentage = vatRate;
    }
    if (isExistPayment) {
        const payment = yield payments_models_1.default.findByIdAndUpdate(isExistPayment === null || isExistPayment === void 0 ? void 0 : isExistPayment._id, { tranId }, { new: true });
        paymentData = payment;
        paymentData.amount = amount;
        // Add VAT for users with vat_type = "Romania"
    }
    else {
        payload.tranId = tranId;
        payload.amount = amount;
        payload.vatAmount = vat;
        payload.vatParcentage = vatParcentage;
        const createdPayment = yield payments_models_1.default.create(payload);
        if (!createdPayment) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create payment');
        }
        paymentData = createdPayment;
    }
    // if (!paymentData)
    //   throw new AppError(httpStatus.BAD_REQUEST, 'payment not found');
    const checkoutSession = yield (0, payments_utils_1.createCheckoutSession)({
        // customerId: customer.id,
        product: {
            amount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
            //@ts-ignore
            name: (_a = subscription === null || subscription === void 0 ? void 0 : subscription.package) === null || _a === void 0 ? void 0 : _a.title,
            quantity: 1,
        },
        //@ts-ignore
        paymentId: paymentData === null || paymentData === void 0 ? void 0 : paymentData._id,
    });
    return checkoutSession === null || checkoutSession === void 0 ? void 0 : checkoutSession.url;
});
const confirmPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { sessionId, paymentId } = query;
    const session = yield (0, mongoose_1.startSession)();
    const PaymentSession = yield stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId = PaymentSession.payment_intent;
    if (PaymentSession.status !== 'complete') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment session is not completed');
    }
    try {
        session.startTransaction();
        const payment = yield payments_models_1.default.findByIdAndUpdate(paymentId, { isPaid: true, paymentIntentId: paymentIntentId }, { new: true, session }).populate('user');
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment Not Found!');
        }
        const oldSubscription = yield subscription_models_1.default.findOneAndUpdate({
            user: payment === null || payment === void 0 ? void 0 : payment.user,
            isPaid: true,
            isExpired: false,
        }, {
            isExpired: true,
        }, { upsert: false, session });
        const subscription = yield subscription_models_1.default.findById(payment === null || payment === void 0 ? void 0 : payment.subscription)
            .populate('package')
            .session(session);
        if (!subscription) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription Not Found!');
        }
        let expiredAt;
        if ((oldSubscription === null || oldSubscription === void 0 ? void 0 : oldSubscription.expiredAt) &&
            (0, moment_1.default)(oldSubscription.expiredAt).isAfter((0, moment_1.default)())) {
            const remainingTime = (0, moment_1.default)(oldSubscription.expiredAt).diff((0, moment_1.default)());
            expiredAt = (0, moment_1.default)().add(remainingTime, 'milliseconds');
        }
        else {
            expiredAt = (0, moment_1.default)();
        }
        if ((_a = subscription === null || subscription === void 0 ? void 0 : subscription.package) === null || _a === void 0 ? void 0 : _a.durationDay) {
            expiredAt = expiredAt.add((_b = subscription === null || subscription === void 0 ? void 0 : subscription.package) === null || _b === void 0 ? void 0 : _b.durationDay, 'days');
        }
        expiredAt = expiredAt.toDate();
        yield subscription_models_1.default.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.subscription, {
            isPaid: true,
            trnId: payment === null || payment === void 0 ? void 0 : payment.tranId,
        }, {
            session,
        }).populate('package');
        // Update User with package values if applicable
        const user = yield user_models_1.User.findById(payment === null || payment === void 0 ? void 0 : payment.user).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found!');
        }
        const packageDetails = subscription === null || subscription === void 0 ? void 0 : subscription.package;
        if (packageDetails) {
            const { carCreateLimit, durationDay } = packageDetails;
            user.carCreateLimit = (user.carCreateLimit || 0) + (carCreateLimit || 0);
            user.durationDay = (user.durationDay || 0) + (durationDay || 0);
            yield user.save({ session });
        }
        yield packages_models_1.default.findByIdAndUpdate(packageDetails === null || packageDetails === void 0 ? void 0 : packageDetails._id, {
            $inc: { popularity: 1 },
        }, { upsert: false, new: true, session });
        const admin = yield user_models_1.User.findOne({ role: user_constants_1.USER_ROLE.admin });
        yield notification_model_1.Notification.create([
            {
                receiver: (_c = payment === null || payment === void 0 ? void 0 : payment.user) === null || _c === void 0 ? void 0 : _c._id,
                message: 'Your subscription payment was successful!',
                description: `Your payment with ID ${payment._id} has been processed successfully. Thank you for subscribing!`,
                refference: payment === null || payment === void 0 ? void 0 : payment._id,
                model_type: notification_interface_1.modeType === null || notification_interface_1.modeType === void 0 ? void 0 : notification_interface_1.modeType.Payment,
            },
            {
                receiver: admin === null || admin === void 0 ? void 0 : admin._id,
                message: 'A new subscription payment has been made.',
                description: `User ${(_d = payment.user) === null || _d === void 0 ? void 0 : _d.email} has successfully made a payment for their subscription. Payment ID: ${payment._id}.`,
                refference: payment === null || payment === void 0 ? void 0 : payment._id,
                model_type: notification_interface_1.modeType === null || notification_interface_1.modeType === void 0 ? void 0 : notification_interface_1.modeType.Payment,
            },
        ], { session });
        yield session.commitTransaction();
        return payment;
    }
    catch (error) {
        yield session.abortTransaction();
        if (paymentIntentId) {
            try {
                yield stripe.refunds.create({
                    payment_intent: paymentIntentId,
                });
            }
            catch (refundError) {
                console.error('Error processing refund:', refundError.message);
            }
        }
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, error.message);
    }
    finally {
        session.endSession();
    }
});
const getEarnings = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const today = (0, moment_1.default)().startOf('day');
    const earnings = yield payments_models_1.default.aggregate([
        {
            $match: {
                isPaid: true,
            },
        },
        {
            $facet: {
                totalEarnings: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' },
                        },
                    },
                ],
                todayEarnings: [
                    {
                        $match: {
                            isDeleted: false,
                            createdAt: {
                                $gte: today.toDate(),
                                $lte: today.endOf('day').toDate(),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }, // Sum of today's earnings
                        },
                    },
                ],
                allData: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    {
                        $lookup: {
                            from: 'subscriptions',
                            localField: 'subscription',
                            foreignField: '_id',
                            as: 'subscriptionDetails',
                        },
                    },
                    {
                        $unwind: {
                            path: '$subscriptionDetails',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'packages', // Name of the package collection
                            localField: 'subscriptionDetails.package', // Field in the subscription referring to package
                            foreignField: '_id', // Field in the package collection
                            as: 'packageDetails',
                        },
                    },
                    {
                        $project: {
                            user: { $arrayElemAt: ['$userDetails', 0] }, // Extract first user if multiple exist
                            subscription: '$subscriptionDetails', // Already an object, no need for $arrayElemAt
                            package: { $arrayElemAt: ['$packageDetails', 0] }, // Extract first package
                            amount: 1,
                            tranId: 1,
                            status: 1,
                            isPaid: 1,
                            id: 1,
                            _id: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                ],
            },
        },
    ]);
    const totalEarnings = ((earnings === null || earnings === void 0 ? void 0 : earnings.length) > 0 &&
        ((_b = (_a = earnings[0]) === null || _a === void 0 ? void 0 : _a.totalEarnings) === null || _b === void 0 ? void 0 : _b.length) > 0 &&
        ((_d = (_c = earnings[0]) === null || _c === void 0 ? void 0 : _c.totalEarnings[0]) === null || _d === void 0 ? void 0 : _d.total.toFixed(2))) ||
        0;
    const todayEarnings = ((earnings === null || earnings === void 0 ? void 0 : earnings.length) > 0 && ((_f = (_e = earnings[0]) === null || _e === void 0 ? void 0 : _e.todayEarnings) === null || _f === void 0 ? void 0 : _f.length) > 0 && ((_h = (_g = earnings[0]) === null || _g === void 0 ? void 0 : _g.todayEarnings[0]) === null || _h === void 0 ? void 0 : _h.total.toFixed(2))) ||
        0;
    const allData = ((_j = earnings[0]) === null || _j === void 0 ? void 0 : _j.allData) || [];
    return { totalEarnings, todayEarnings, allData };
});
const dashboardData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const usersData = yield user_models_1.User.aggregate([
        {
            $facet: {
                totalUsers: [{ $match: { status: 'active' } }, { $count: 'count' }],
                userDetails: [
                    { $match: { role: { $ne: user_constants_1.USER_ROLE.admin } } },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            coin: 1,
                            role: 1,
                            referenceId: 1,
                            createdAt: 1,
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $limit: 15,
                    },
                ],
            },
        },
    ]);
    // const today = moment().startOf('day');
    // Calculate today's income
    const earnings = yield payments_models_1.default.aggregate([
        {
            $match: {
                isPaid: true,
            },
        },
        {
            $facet: {
                totalEarnings: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' },
                        },
                    },
                ],
                allData: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    {
                        $lookup: {
                            from: 'subscription',
                            localField: 'subscription',
                            foreignField: '_id',
                            as: 'subscription',
                        },
                    },
                    {
                        $project: {
                            user: { $arrayElemAt: ['$userDetails', 0] },
                            subscription: { $arrayElemAt: ['$subscription', 0] },
                            amount: 1,
                            tranId: 1,
                            status: 1,
                            id: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $limit: 10,
                    },
                ],
            },
        },
    ]);
    const totalEarnings = ((earnings === null || earnings === void 0 ? void 0 : earnings.length) > 0 &&
        ((_b = (_a = earnings[0]) === null || _a === void 0 ? void 0 : _a.totalEarnings) === null || _b === void 0 ? void 0 : _b.length) > 0 &&
        ((_d = (_c = earnings[0]) === null || _c === void 0 ? void 0 : _c.totalEarnings[0]) === null || _d === void 0 ? void 0 : _d.total)) ||
        0;
    const totalCustomer = yield user_models_1.User.countDocuments({ role: user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.user });
    const totalServiceProvider = yield user_models_1.User.countDocuments({
        role: user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer,
    });
    const transitionData = ((_e = earnings[0]) === null || _e === void 0 ? void 0 : _e.allData) || [];
    // Calculate monthly income
    const year = query.incomeYear ? query.incomeYear : (0, moment_1.default)().year();
    const startOfYear = (0, moment_1.default)().year(year).startOf('year');
    const endOfYear = (0, moment_1.default)().year(year).endOf('year');
    const monthlyIncome = yield payments_models_1.default.aggregate([
        {
            $match: {
                isPaid: true,
                createdAt: {
                    $gte: startOfYear.toDate(),
                    $lte: endOfYear.toDate(),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                income: { $sum: '$amount' },
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);
    // Format monthly income to have an entry for each month
    const formattedMonthlyIncome = Array.from({ length: 12 }, (_, index) => ({
        month: (0, moment_1.default)().month(index).format('MMM'),
        income: 0,
    }));
    monthlyIncome.forEach(entry => {
        formattedMonthlyIncome[entry._id.month - 1].income = Math.round(entry.income);
    });
    // Calculate monthly income
    // JoinYear: '2022', role: ''
    const userYear = (query === null || query === void 0 ? void 0 : query.JoinYear) ? query === null || query === void 0 ? void 0 : query.JoinYear : (0, moment_1.default)().year();
    const startOfUserYear = (0, moment_1.default)().year(userYear).startOf('year');
    const endOfUserYear = (0, moment_1.default)().year(userYear).endOf('year');
    const monthlyUser = yield user_models_1.User.aggregate([
        {
            $match: {
                status: 'active',
                createdAt: {
                    $gte: startOfUserYear.toDate(),
                    $lte: endOfUserYear.toDate(),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$createdAt' } },
                total: { $sum: 1 }, // Corrected to count the documents
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);
    // Format monthly income to have an entry for each month
    const formattedMonthlyUsers = Array.from({ length: 12 }, (_, index) => ({
        month: (0, moment_1.default)().month(index).format('MMM'),
        total: 0,
    }));
    monthlyUser.forEach(entry => {
        formattedMonthlyUsers[entry._id.month - 1].total = Math.round(entry.total);
    });
    return {
        totalUsers: ((_g = (_f = usersData[0]) === null || _f === void 0 ? void 0 : _f.totalUsers[0]) === null || _g === void 0 ? void 0 : _g.count) || 0,
        totalCustomer,
        totalServiceProvider,
        transitionData,
        totalIncome: totalEarnings,
        // toDayIncome: todayEarnings,
        monthlyIncome: formattedMonthlyIncome,
        monthlyUsers: formattedMonthlyUsers,
        userDetails: (_h = usersData[0]) === null || _h === void 0 ? void 0 : _h.userDetails,
    };
});
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payments_models_1.default.find();
    if (!payments || payments.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No payments found');
    }
    return payments;
});
const getPaymentsByUserId = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQueryBuilder = new QueryBuilder_1.default(payments_models_1.default.find({ user: userId, isPaid: true }).populate({
        path: 'subscription',
        populate: { path: 'package' },
    }).populate('user'), query)
        .search(['paymentStatus', 'transactionId', 'subscription.name'])
        .filter()
        .paginate()
        .sort();
    const data = yield paymentQueryBuilder.modelQuery;
    const meta = yield paymentQueryBuilder.countTotal();
    // if (!data || data.length === 0) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'No payments found for the user');
    // }
    return {
        data,
        meta,
    };
});
// Get a payment by ID
const getPaymentsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payments_models_1.default.findById(id);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found');
    }
    return payment;
});
// Update a payment by ID
const updatePayments = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPayment = yield payments_models_1.default.findByIdAndUpdate(id, updatedData, {
        new: true,
    });
    if (!updatedPayment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found to update');
    }
    return updatedPayment;
});
// Delete a payment by ID
const deletePayments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedPayment = yield payments_models_1.default.findByIdAndDelete(id);
    if (!deletedPayment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found to delete');
    }
    return deletedPayment;
});
const generateInvoice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existingInvoice = yield invoice_models_1.default
        .findOne({ paymentId: payload })
        .populate([
        {
            path: 'paymentId',
            populate: [
                {
                    path: 'user',
                },
                {
                    path: 'subscription',
                    populate: { path: 'package', model: 'Package' },
                },
            ],
        },
    ]);
    if (existingInvoice) {
        return existingInvoice;
    }
    const payment = yield payments_models_1.default.findById(payload)
        .populate({
        path: 'user',
        model: user_models_1.User,
        strictPopulate: false,
    })
        .populate({
        path: 'subscription',
        model: subscription_models_1.default,
        strictPopulate: false,
        populate: {
            path: 'package',
            model: 'Package',
        },
    });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const users = payment.user;
    // if (users.vat_status !== 'valid') {
    //   throw new Error('VAT status is not valid for the user');
    // }
    const vatAmount = users.vat_type === 'Romania' ? 0.19 : 0;
    const packageAmount = ((_a = payment.subscription.package) === null || _a === void 0 ? void 0 : _a.price) || 0;
    const totalAmount = packageAmount * (1 + vatAmount);
    const invoiceNumber = `INV-${Date.now()}`;
    const invoiceDate = new Date();
    const invoices = new invoice_models_1.default({
        paymentId: payment._id,
        invoiceNumber,
        invoiceDate,
        totalAmount: totalAmount.toFixed(2), // Store total amount as a string
    });
    const result = yield (yield invoice_models_1.default.create(invoices)).populate([
        {
            path: 'paymentId',
            populate: [
                {
                    path: 'user',
                    select: 'name phoneNumber companyName dealership vat_type vat_status',
                },
                { path: 'subscription', populate: { path: 'package' } },
            ],
        },
    ]);
    // Respond with the invoice details
    return result;
});
exports.paymentsService = {
    // createPayments,
    getAllPayments,
    getPaymentsById,
    updatePayments,
    deletePayments,
    checkout,
    confirmPayment,
    dashboardData,
    getEarnings,
    getPaymentsByUserId,
    generateInvoice,
};
