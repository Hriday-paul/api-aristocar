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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("./user.models");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constants_1 = require("./user.constants");
const mailSender_1 = require("../../utils/mailSender");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_models_1.User.isUserExist(payload.email);
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
    }
    // If the user is registering as a dealer, set isApproved to false
    if (payload.role === user_constants_1.USER_ROLE.dealer) {
        payload.isApproved = false; // Dealer accounts need admin approval
        const emailPath = path_1.default.join(__dirname, '../../../../public/view/dealerRegisterMail.html');
        // If 'isApproved' is set to true, send an email
        yield (0, mailSender_1.sendEmail)(payload === null || payload === void 0 ? void 0 : payload.email, 'Your account has been approved', fs_1.default
            .readFileSync(emailPath, 'utf8')
            .replace('{{name}}', payload === null || payload === void 0 ? void 0 : payload.name)
            .replace('{{email}}', payload === null || payload === void 0 ? void 0 : payload.email));
    }
    if (payload === null || payload === void 0 ? void 0 : payload.isGoogleLogin) {
        payload.verification = {
            otp: 0,
            expiresAt: new Date(Date.now()),
            status: true,
        };
    }
    if (!payload.isGoogleLogin && !payload.password) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
    }
    if (payload.role === user_constants_1.USER_ROLE.dealer &&
        (!payload.companyName || !payload.dealership)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Company name and dealership are required for dealer role.');
    }
    // if (payload.role === USER_ROLE.dealer) {
    //   if (payload.dealer_address?.vat_id) {
    //     try {
    //       const result = await validateVATNumber(payload.dealer_address.vat_id);
    //       // Update VAT status based on validation result
    //       payload.vat_status = result.isValid ? 'valid' : 'vat not valid';
    //     } catch (error) {
    //       console.error('VAT validation error:'); // Log the error for debugging
    //       payload.vat_status = 'vat not valid'; // Fallback status
    //       throw new AppError(httpStatus.NOT_FOUND, 'VAT ID Not Valid');
    //     }
    //   } else {
    //     // If VAT ID is not provided, set status as 'vat not valid'
    //     payload.vat_status = 'vat not valid';
    //   }
    // }
    const user = yield user_models_1.User.create(payload);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User creation failed');
    }
    return user;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = new QueryBuilder_1.default(user_models_1.User.find(), query)
        .search(['name', 'email', 'phoneNumber', 'status'])
        .filter()
        .paginate()
        .sort();
    const data = yield userModel.modelQuery;
    const meta = yield userModel.countTotal();
    return {
        data,
        meta,
    };
});
const getAllUserByYearandmonth = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31T23:59:59`);
    // Initialize an object to hold counts for each month
    const userCountsByMonth = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    };
    // Query to get all users within the year
    const users = yield user_models_1.User.find({
        createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
        },
    });
    // Loop through the users and count them by month
    users.forEach(user => {
        const month = new Date(user.createdAt).toLocaleString('default', {
            month: 'long',
        });
        if (userCountsByMonth[month] !== undefined) {
            userCountsByMonth[month]++;
        }
    });
    return userCountsByMonth;
});
const geUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_models_1.User.findById(id);
    return result;
});
const getAllDealerRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_models_1.User.find({ role: user_constants_1.USER_ROLE.dealer, isApproved: false });
});
const handleDealerRequest = (dealerId, isApproved) => __awaiter(void 0, void 0, void 0, function* () {
    const dealer = yield user_models_1.User.findById(dealerId);
    if (!dealer || dealer.role !== user_constants_1.USER_ROLE.dealer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Dealer request not found');
    }
    if (isApproved) {
        dealer.isApproved = true;
    }
    else {
        dealer.isApproved = false;
        dealer.role = user_constants_1.USER_ROLE.user;
    }
    yield dealer.save();
    return dealer;
});
const getAllDealers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const dealerQuery = new QueryBuilder_1.default(user_models_1.User.find({ role: user_constants_1.USER_ROLE.dealer }), query)
        .search(['name', 'email', 'phoneNumber', 'status'])
        .filter()
        .paginate()
        .sort();
    const data = yield dealerQuery.modelQuery;
    const meta = yield dealerQuery.countTotal();
    return {
        data,
        meta,
    };
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const user = yield user_models_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Manage user payload based on role
    if (user.role === user_constants_1.USER_ROLE.dealer) {
        delete payload.user_address;
    }
    else {
        delete payload.dealer_address;
    }
    // Exclude fields that cannot be updated
    const restrictedFields = [
        'email',
        'dealership',
        'invoice_type',
        'isGoogleLogin',
        'password',
        'role',
        'verification',
        'isDeleted',
    ];
    restrictedFields.forEach(field => {
        delete payload[field];
    });
    // Update the user
    const updatedUser = yield user_models_1.User.findByIdAndUpdate(id, payload, {
        new: true, // Return the updated document
        runValidators: true, // Apply schema validation
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User update failed');
    }
    // Remove the password from the response
    updatedUser.password = undefined;
    const emailPath = path_1.default.join(__dirname, '../../../../public/view/delearApproved.html');
    // If 'isApproved' is set to true, send an email
    if (payload.isApproved === true) {
        yield (0, mailSender_1.sendEmail)(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email, 'Your account has been approved', fs_1.default
            .readFileSync(emailPath, 'utf8')
            .replace('{{name}}', updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name)
            .replace('{{email}}', user === null || user === void 0 ? void 0 : user.email));
    }
    return updatedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'user deleting failed');
    }
    return user;
});
exports.userService = {
    createUser,
    getAllUser,
    geUserById,
    updateUser,
    deleteUser,
    getAllDealerRequests,
    handleDealerRequest,
    getAllUserByYearandmonth,
    getAllDealers,
};
