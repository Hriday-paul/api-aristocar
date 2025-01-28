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
exports.modelsService = exports.getModelsByBrand = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const brands_models_1 = __importDefault(require("../brands/brands.models"));
const models_models_1 = __importDefault(require("./models.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createmodels = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brands_models_1.default.findById(payload.brandId);
    if (!brands) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Brand not found');
    }
    const newModel = yield models_models_1.default.create(payload);
    return newModel;
});
const getModelsByBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brands_models_1.default.findById(brandId);
    if (!brands) {
        throw new Error('Brand not found');
    }
    const models = yield models_models_1.default.find({ brandId: brandId }).populate('brandId');
    return {
        brands,
        models,
    };
});
exports.getModelsByBrand = getModelsByBrand;
const getAllmodels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modelQuery = new QueryBuilder_1.default(models_models_1.default.find({}).populate('brandId'), query).search(['modelName']);
    const data = yield modelQuery.modelQuery;
    const meta = yield modelQuery.countTotal();
    if (!data || data.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No models found');
    }
    return {
        data,
    };
});
const getmodelsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield models_models_1.default.findById(id).populate('brand');
    if (!model) {
        throw new Error('Model not found');
    }
    return model;
});
const updatemodels = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield models_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate('brand');
    if (!model) {
        throw new Error('Model not found');
    }
    return model;
});
const deletemodels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield models_models_1.default.findByIdAndDelete(id);
    if (!model) {
        throw new Error('Model not found');
    }
});
exports.modelsService = {
    createmodels,
    getAllmodels,
    getmodelsById,
    updatemodels,
    deletemodels,
    getModelsByBrand: exports.getModelsByBrand,
};
