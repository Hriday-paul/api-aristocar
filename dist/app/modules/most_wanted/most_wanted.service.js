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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostWantedService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const most_wanted_models_1 = __importDefault(require("./most_wanted.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createMostWanted = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newMostWanted = yield most_wanted_models_1.default.create(payload);
    return newMostWanted;
});
// services
const getAllMostWanted = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const isQueryEmpty = Object.keys(query).length === 0;
    let data, meta;
    if (isQueryEmpty) {
        data = yield most_wanted_models_1.default.find().populate({
            path: 'carId',
            populate: ['brand', 'model', 'creatorID'],
        });
        const mostWantedModel = new QueryBuilder_1.default(most_wanted_models_1.default.find({}), {});
        meta = yield mostWantedModel.countTotal();
    }
    else {
        const { priceRange, mileageRange, YearOfManufactureRange } = query, allQuery = __rest(query, ["priceRange", "mileageRange", "YearOfManufactureRange"]);
        const mostWantedModel = new QueryBuilder_1.default(most_wanted_models_1.default.find({}), allQuery)
            .search(['name'])
            .conditionalFilter()
            .sort()
            .paginate()
            .fields();
        data = (yield mostWantedModel.modelQuery.populate({
            path: 'carId',
            populate: ['brand', 'model', 'creatorID'],
        }));
        meta = yield mostWantedModel.countTotal();
    }
    return { data, meta };
});
const getMostWantedById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mostWanted = yield most_wanted_models_1.default.findById(id).populate('carId');
    if (!mostWanted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Most wanted entry not found');
    }
    return mostWanted;
});
const updateMostWanted = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMostWanted = yield most_wanted_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedMostWanted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Most wanted entry not found');
    }
    return updatedMostWanted;
});
const deleteMostWanted = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMostWanted = yield most_wanted_models_1.default.findByIdAndDelete(id);
    if (!deletedMostWanted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Most wanted entry not found');
    }
});
exports.mostWantedService = {
    createMostWanted,
    getAllMostWanted,
    getMostWantedById,
    updateMostWanted,
    deleteMostWanted,
};
