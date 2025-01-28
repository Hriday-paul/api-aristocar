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
exports.mostWantedController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const most_wanted_service_1 = require("./most_wanted.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const http_status_1 = __importDefault(require("http-status"));
const createMostWanted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.image = yield (0, s3_1.uploadToS3)({
            file: req.file, // Ensure it's req.file for a single file
            fileName: `images/mostwanted/cars/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield most_wanted_service_1.mostWantedService.createMostWanted(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Most wanted entry created successfully',
        data: result,
    });
}));
const getAllMostWanted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mostWanted = yield most_wanted_service_1.mostWantedService.getAllMostWanted(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All most wanted entries fetched successfully',
        data: { mostWanted },
    });
}));
const getMostWantedById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield most_wanted_service_1.mostWantedService.getMostWantedById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Most wanted entry fetched successfully',
        data: result,
    });
}));
const updateMostWanted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield most_wanted_service_1.mostWantedService.updateMostWanted(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Most wanted entry updated successfully',
        data: result,
    });
}));
const deleteMostWanted = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield most_wanted_service_1.mostWantedService.deleteMostWanted(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Most wanted entry deleted successfully',
        data: null,
    });
}));
exports.mostWantedController = {
    createMostWanted,
    getAllMostWanted,
    getMostWantedById,
    updateMostWanted,
    deleteMostWanted,
};
