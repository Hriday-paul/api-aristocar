"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("./user.constants");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const multer_1 = __importStar(require("multer"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create', upload.single('image'), (0, parseData_1.default)(), (0, validateRequest_1.default)(user_validation_1.userValidation === null || user_validation_1.userValidation === void 0 ? void 0 : user_validation_1.userValidation.guestValidationSchema), user_controller_1.userController.createUser);
router.patch('/update/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), upload.single('image'), (0, parseData_1.default)(), user_controller_1.userController.updateUser);
router.patch('/update-my-profile', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.dealer), upload.single('image'), (0, parseData_1.default)(), user_controller_1.userController.updateMyProfile);
router.get('/by-year-month/:year', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.dealer), user_controller_1.userController.getAllUserByYearandmonth);
router.get('/dealer', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.getAllDealers);
router.get('/dealer-requests', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.getAllDealerRequests);
router.patch('/dealer-requests/:dealerId', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.handleDealerRequest);
router.delete('/delete-my-account', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.deleteMYAccount);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.deleteUser);
router.get('/my-profile', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.dealer), user_controller_1.userController.getMyProfile);
router.get('/:id', user_controller_1.userController.getUserById);
router.get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), user_controller_1.userController.getAllUser);
exports.userRoutes = router;
