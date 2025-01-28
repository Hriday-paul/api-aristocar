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
exports.modelsController = exports.getModelsByBrand = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const models_service_1 = require("./models.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createmodels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_service_1.modelsService.createmodels(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Model created successfully',
        data: result,
    });
}));
exports.getModelsByBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_service_1.modelsService.getModelsByBrand(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Models fetched successfully',
        data: result,
    });
}));
const getAllmodels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield models_service_1.modelsService.getAllmodels(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All models fetched successfully',
        data: result,
    });
}));
const getmodelsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_service_1.modelsService.getmodelsById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Model fetched successfully',
        data: result,
    });
}));
const updatemodels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield models_service_1.modelsService.updatemodels(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Model updated successfully',
        data: result,
    });
}));
const deletemodels = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield models_service_1.modelsService.deletemodels(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Model deleted successfully',
        data: null,
    });
}));
exports.modelsController = {
    createmodels,
    getAllmodels,
    getmodelsById,
    updatemodels,
    deletemodels,
    getModelsByBrand: exports.getModelsByBrand,
};
