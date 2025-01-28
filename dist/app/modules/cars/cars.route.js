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
exports.carsRoutes = void 0;
const express_1 = require("express");
const cars_controller_1 = require("./cars.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer), upload.fields([{ name: 'images', maxCount: 5 }]), (0, parseData_1.default)(), cars_controller_1.carsController.createcars);
router.patch('/update/:id', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer, user_constants_1.USER_ROLE.admin), upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'bannerImage', maxCount: 1 },
]), (0, parseData_1.default)(), cars_controller_1.carsController.updatecars);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.dealer, user_constants_1.USER_ROLE.admin), cars_controller_1.carsController.deletecars);
router.get('/bestdeal', cars_controller_1.carsController.getBestDeals);
router.get('/most-wanted', cars_controller_1.carsController.getMostWantedCars);
router.get('/count', (0, auth_1.default)(user_constants_1.USER_ROLE.dealer, user_constants_1.USER_ROLE.admin), cars_controller_1.carsController.getcarsCountBycreatorId);
router.get('/views-for-user', (0, auth_1.default)(user_constants_1.USER_ROLE.dealer, user_constants_1.USER_ROLE.admin), cars_controller_1.carsController.getUserCarViewsByYear);
router.get('/creator/:creatorID', cars_controller_1.carsController.getcarsByCreatorId);
router.get('/:id', cars_controller_1.carsController.getcarsById);
router.get('/', cars_controller_1.carsController.getAllcars);
exports.carsRoutes = router;
