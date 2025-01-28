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
exports.termsService = void 0;
const terms_models_1 = __importDefault(require("./terms.models")); // Import your Terms model
// Create Terms
const createterms = (description) => __awaiter(void 0, void 0, void 0, function* () {
    const newTerms = yield terms_models_1.default.create({ description });
    return newTerms;
});
// Get All Terms
const getAllterms = () => __awaiter(void 0, void 0, void 0, function* () {
    const termsList = yield terms_models_1.default.find();
    return termsList;
});
// Get Terms by ID
const gettermsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const terms = yield terms_models_1.default.findById(id);
    return terms;
});
// Update Terms
const updateterms = (id, description) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTerms = yield terms_models_1.default.findByIdAndUpdate(id, { description }, { new: true });
    return updatedTerms;
});
// Delete Terms
const deleteterms = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedTerms = yield terms_models_1.default.findByIdAndDelete(id);
    return deletedTerms;
});
exports.termsService = {
    createterms,
    getAllterms,
    gettermsById,
    updateterms,
    deleteterms,
};
