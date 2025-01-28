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
exports.privacyService = void 0;
const privacy_models_1 = __importDefault(require("./privacy.models"));
const createprivacy = (description) => __awaiter(void 0, void 0, void 0, function* () {
    const newPrivacy = yield privacy_models_1.default.create({ description });
    return newPrivacy;
});
const getAllprivacy = () => __awaiter(void 0, void 0, void 0, function* () {
    const privacyList = yield privacy_models_1.default.find();
    return privacyList;
});
const getprivacyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const privacy = yield privacy_models_1.default.findById(id);
    return privacy;
});
const updateprivacy = (id, description) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPrivacy = yield privacy_models_1.default.findByIdAndUpdate(id, { description }, { new: true });
    return updatedPrivacy;
});
const deleteprivacy = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedPrivacy = yield privacy_models_1.default.findByIdAndDelete(id);
    return deletedPrivacy;
});
exports.privacyService = {
    createprivacy,
    getAllprivacy,
    getprivacyById,
    updateprivacy,
    deleteprivacy,
};
