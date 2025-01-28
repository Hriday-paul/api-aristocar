"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoutes = void 0;
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const user_constants_1 = require("../user/user.constants");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.post('/create-contact', (0, auth_1.default)(user_constants_1.USER_ROLE.dealer, user_constants_1.USER_ROLE.user), contact_controller_1.contactController.createcontact);
// router.patch('/update/:id', contactController.updatecontact);
// router.delete('/:id', contactController.deletecontact);
// router.get('/user/:id', contactController.getcontactByUserId);
router.get('/:id', contact_controller_1.contactController.getcontactById);
router.get('/', contact_controller_1.contactController.getAllcontact);
exports.contactRoutes = router;
