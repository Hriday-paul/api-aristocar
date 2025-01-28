"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelsRoutes = void 0;
const express_1 = require("express");
const models_controller_1 = require("./models.controller");
const user_constants_1 = require("../user/user.constants");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.post('/create-models', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), models_controller_1.modelsController.createmodels);
router.patch('/update/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), models_controller_1.modelsController.updatemodels);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), models_controller_1.modelsController.deletemodels);
router.get('/:id', models_controller_1.modelsController.getModelsByBrand);
router.get('/', models_controller_1.modelsController.getAllmodels);
exports.modelsRoutes = router;
