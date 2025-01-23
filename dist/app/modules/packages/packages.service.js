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
exports.packagesService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const packages_models_1 = __importDefault(require("./packages.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createPackages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield packages_models_1.default.create(payload);
    if (!packages) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create packages');
    }
    return packages;
});
const getAllPackages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const packagesModel = new QueryBuilder_1.default(packages_models_1.default.find(), query)
        .search(['title'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield packagesModel.modelQuery;
    const meta = yield packagesModel.countTotal();
    return {
        data,
        meta,
    };
});
const getPackagesById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Packages not found');
    }
    return result;
});
const updatePackages = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield packages_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!packages) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Packages not found');
    }
    return packages;
});
const deletePackages = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield packages_models_1.default.findByIdAndUpdate(id, {
        isDeleted: true,
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Packages Delete failed');
    }
    return result;
});
exports.packagesService = {
    createPackages,
    getAllPackages,
    getPackagesById,
    updatePackages,
    deletePackages,
};
