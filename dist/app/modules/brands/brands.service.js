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
exports.brandsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const brands_models_1 = __importDefault(require("./brands.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createbrands = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBrand = yield brands_models_1.default.findOne({ brandName: payload.brandName });
    if (existingBrand) {
        throw new Error('Brand already exists');
    }
    const newBrand = yield brands_models_1.default.create(payload);
    return newBrand;
});
const getAllbrands = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandModel = new QueryBuilder_1.default(brands_models_1.default.find({}), query)
        .search(['brandName'])
        .filter()
        .paginate()
        .sort();
    const data = yield brandModel.modelQuery;
    const meta = yield brandModel.countTotal();
    if (!data || data.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No brands found');
    }
    return {
        data,
    };
});
const getbrandsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brands_models_1.default.findById(id);
    if (!brands) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand not found');
    }
    return brands;
});
const getHomeShow = () => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield brands_models_1.default.find({ isHome: true });
    return brands;
});
const updatebrands = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBrand = yield brands_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedBrand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand not found');
    }
    return updatedBrand;
});
const deletebrands = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedBrand = yield brands_models_1.default.findByIdAndDelete(id);
    if (!deletedBrand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Brand not found');
    }
});
exports.brandsService = {
    createbrands,
    getAllbrands,
    getbrandsById,
    updatebrands,
    deletebrands,
    getHomeShow,
};
