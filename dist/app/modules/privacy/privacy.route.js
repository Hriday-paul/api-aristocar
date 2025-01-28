"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyRoutes = void 0;
const express_1 = require("express");
const privacy_controller_1 = require("./privacy.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
// Create Privacy
router.post('/create-privacy', privacy_controller_1.privacyController.createprivacy);
// Update Privacy
router.patch('/update/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), privacy_controller_1.privacyController.updateprivacy);
// Delete Privacy
// router.delete('/:id', privacyController.deleteprivacy);
// Get Privacy by ID
router.get('/:id', privacy_controller_1.privacyController.getprivacyById);
// Get All Privacy
// router.get('/', privacyController.getAllprivacy);
exports.privacyRoutes = router;
