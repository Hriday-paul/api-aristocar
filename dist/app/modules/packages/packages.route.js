"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packagesRoutes = void 0;
const express_1 = require("express");
const packages_controller_1 = require("./packages.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const packages_validation_1 = require("./packages.validation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), (0, validateRequest_1.default)(packages_validation_1.packageValidator.createPackageValidator), packages_controller_1.packagesController.createPackages);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), (0, validateRequest_1.default)(packages_validation_1.packageValidator.updatePackageValidator), packages_controller_1.packagesController.updatePackages);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), packages_controller_1.packagesController.deletePackages);
router.get('/:id', packages_controller_1.packagesController.getPackagesById);
router.get('/', packages_controller_1.packagesController.getAllPackages);
exports.packagesRoutes = router;
