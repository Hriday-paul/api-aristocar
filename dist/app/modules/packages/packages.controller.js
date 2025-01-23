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
exports.packagesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const packages_service_1 = require("./packages.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_service_1.packagesService.createPackages(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Packages created successfully',
        data: result,
    });
}));
const getAllPackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_service_1.packagesService.getAllPackages(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All packages fetched successfully',
        data: result,
    });
}));
const getPackagesById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_service_1.packagesService.getPackagesById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Packages fetched successfully',
        data: result,
    });
}));
const updatePackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_service_1.packagesService.updatePackages(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Packages updated successfully',
        data: result,
    });
}));
const deletePackages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_service_1.packagesService.deletePackages(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Packages deleted successfully',
        data: result,
    });
}));
exports.packagesController = {
    createPackages,
    getAllPackages,
    getPackagesById,
    updatePackages,
    deletePackages,
};
