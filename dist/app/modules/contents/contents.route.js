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
exports.contentsRoutes = void 0;
const express_1 = require("express");
const contents_controller_1 = require("./contents.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const multer_1 = __importStar(require("multer"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create-content', (0, auth_1.default)(user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.admin), upload.fields([{ name: 'banner', maxCount: 5 }]), (0, parseData_1.default)(), 
// validateRequest(contentsValidator.createContentsZodSchema),
contents_controller_1.contentsController.createContents);
router.put('/', (0, auth_1.default)(user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.admin), upload.fields([{ name: 'banner', maxCount: 5 }]), (0, parseData_1.default)(), contents_controller_1.contentsController.updateContents);
router.delete('/:key', contents_controller_1.contentsController.deleteBanner);
router.get('/:id', contents_controller_1.contentsController.getContentsById);
router.get('/', contents_controller_1.contentsController.getAllContents);
exports.contentsRoutes = router;
