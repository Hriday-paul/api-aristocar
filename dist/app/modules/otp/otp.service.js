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
exports.otpServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpGenerator_1 = require("../../utils/otpGenerator");
const moment_1 = __importDefault(require("moment"));
const mailSender_1 = require("../../utils/mailSender");
const config_1 = __importDefault(require("../../config"));
const user_models_1 = require("../user/user.models");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const verifyOtp = (token, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
    }
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        console.error(err);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Session has expired. Please try to submit OTP within 3 minute');
    }
    const user = yield user_models_1.User.findById(decode === null || decode === void 0 ? void 0 : decode.userId).select('verification status ');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (new Date() > ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.expiresAt)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'OTP has expired. Please resend it');
    }
    if (Number(otp) !== Number((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.otp)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP did not match');
    }
    const updateUser = yield user_models_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: {
            verification: {
                otp: 0,
                expiresAt: (0, moment_1.default)().add(3, 'minute'),
                status: true,
            },
        },
    }, { new: true }).select('email _id username role');
    const jwtPayload = {
        email: updateUser === null || updateUser === void 0 ? void 0 : updateUser.email,
        role: updateUser === null || updateUser === void 0 ? void 0 : updateUser.role,
        userId: updateUser === null || updateUser === void 0 ? void 0 : updateUser._id,
    };
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '30d',
    });
    return { user: updateUser, token: jwtToken };
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)().add(3, 'minute');
    const updateOtp = yield user_models_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: {
            verification: {
                otp,
                expiresAt,
                status: false,
            },
        },
    }, { new: true });
    if (!updateOtp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to resend OTP. Please try again later');
    }
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        userId: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '3m',
    });
    const otpEmailPath = path_1.default.join(__dirname, '../../../../public/view/otp_mail.html');
    yield (0, mailSender_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, 'Your One Time OTP', fs_1.default
        .readFileSync(otpEmailPath, 'utf8')
        .replace('{{otp}}', otp)
        .replace('{{email}}', user === null || user === void 0 ? void 0 : user.email));
    // await sendEmail(
    //   user?.email,
    //   'Your One Time OTP',
    //   `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //     <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    //     <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
    //       <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
    //       <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiresAt.toLocaleString()}</p>
    //     </div>
    //   </div>`,
    // );
    return { token };
});
exports.otpServices = {
    verifyOtp,
    resendOtp,
};
