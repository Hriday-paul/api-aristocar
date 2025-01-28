"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealerContactRoutes = void 0;
const express_1 = require("express");
const dealerContact_controller_1 = require("./dealerContact.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/create-dealerContact', dealerContact_controller_1.dealerContactController.createdealerContact);
// router.patch('/update/:id', dealerContactController.updatedealerContact);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer), dealerContact_controller_1.dealerContactController.deletedealerContact);
router.get('/get-dealerContact', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer), dealerContact_controller_1.dealerContactController.getDealerContact);
router.get('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer), dealerContact_controller_1.dealerContactController.getdealerContactById);
router.get('/', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer), dealerContact_controller_1.dealerContactController.getAlldealerContact);
exports.dealerContactRoutes = router;
