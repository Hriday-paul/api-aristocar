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
exports.authServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const otpGenerator_1 = require("../../utils/otpGenerator");
const moment_1 = __importDefault(require("moment"));
const mailSender_1 = require("../../utils/mailSender");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_models_1 = require("../user/user.models");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const user_constants_1 = require("../user/user.constants");
// Login
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let user = yield user_models_1.User.isUserExist(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        if (payload.isGoogleLogin) {
            user = yield user_models_1.User.create({
                email: payload.email,
                isGoogleLogin: true,
                password: '',
                role: user_constants_1.USER_ROLE.user,
                verification: {
                    status: true,
                },
            });
        }
        else {
            // If not a Google login and user not found, throw error
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
    }
    else {
        if (user === null || user === void 0 ? void 0 : user.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted');
        }
        // If the user is registered with Google, enforce Google login
        if (user.isGoogleLogin && !payload.isGoogleLogin) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You have to login with google ');
        }
        // If the user is not registered with Google but payload has isGoogleLogin
        if (!user.isGoogleLogin && payload.isGoogleLogin) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You dont have google login with this email');
        }
        // Handle Google login case
        if (user.isGoogleLogin) {
            if (!((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.status)) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User account is not verified');
            }
        }
        else {
            // Handle non-Google login case, verify password
            const passwordMatched = yield user_models_1.User.isPasswordMatched(payload.password, user.password);
            if (!passwordMatched) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password does not match');
            }
        }
        if (!((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.status)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User account is not verified');
        }
    }
    const jwtPayload = {
        userId: (_c = user === null || user === void 0 ? void 0 : user._id) === null || _c === void 0 ? void 0 : _c.toString(),
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        user,
        accessToken,
        refreshToken,
    };
});
// Change password
const changePassword = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.IsUserExistId(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!(yield user_models_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Old password does not match');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.newPassword) !== (payload === null || payload === void 0 ? void 0 : payload.confirmPassword)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'New password and confirm password do not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_models_1.User.findByIdAndUpdate(id, {
        $set: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        },
    }, { new: true });
    return result;
});
// Forgot password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.isUserExist(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const jwtPayload = {
        email: email,
        userId: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '3m',
    });
    const currentTime = new Date();
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)(currentTime).add(3, 'minute');
    yield user_models_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        verification: {
            otp,
            expiresAt,
        },
    });
    const otpEmailPath = path_1.default.join(__dirname, '../../../../public/view/forgot_pass_mail.html');
    yield (0, mailSender_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, 'Your reset password OTP is', fs_1.default
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{otp}}', otp)
        .replace('{{email}}', user === null || user === void 0 ? void 0 : user.email));
    // await sendEmail(
    //   email,
    //   'Your reset password OTP is:',
    //   `<div><h5>Your OTP is: ${otp}</h5>
    //   <p>Valid until: ${expiresAt.toLocaleString()}</p>
    //   </div>`,
    // );
    return { email, token };
});
// Reset password
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Session has expired. Please try again');
    }
    const user = yield user_models_1.User.findById(decode === null || decode === void 0 ? void 0 : decode.userId).select('isDeleted verification');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (new Date() > ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.expiresAt)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Session has expired');
    }
    if (!((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.status)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'OTP is not verified yet');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.newPassword) !== (payload === null || payload === void 0 ? void 0 : payload.confirmPassword)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'New password and confirm password do not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_models_1.User.findByIdAndUpdate(decode === null || decode === void 0 ? void 0 : decode.userId, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        verification: {
            otp: 0,
            status: true,
        },
    });
    return result;
});
// Refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId } = decoded;
    const user = yield user_models_1.User.IsUserExistId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted');
    }
    const jwtPayload = {
        userId: (_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.authServices = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
};
