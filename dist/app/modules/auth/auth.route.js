"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.authValidation.loginZodValidationSchema), auth_controller_1.authControllers.login);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.authValidation.refreshTokenValidationSchema), auth_controller_1.authControllers.refreshToken);
router.patch('/change-password', (0, auth_1.default)(user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.user), auth_controller_1.authControllers.changePassword);
router.patch('/forgot-password', auth_controller_1.authControllers.forgotPassword);
router.patch('/reset-password', auth_controller_1.authControllers.resetPassword);
exports.authRoutes = router;
