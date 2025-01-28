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
exports.aboutService = void 0;
const about_models_1 = __importDefault(require("./about.models"));
const createabout = (description) => __awaiter(void 0, void 0, void 0, function* () {
    const newAbout = yield about_models_1.default.create({ description });
    return newAbout;
});
const getAllabout = () => __awaiter(void 0, void 0, void 0, function* () {
    const aboutList = yield about_models_1.default.find();
    return aboutList;
});
const getaboutById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const about = yield about_models_1.default.findById(id);
    return about;
});
const updateabout = (id, description) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedAbout = yield about_models_1.default.findByIdAndUpdate(id, { description }, { new: true });
    return updatedAbout;
});
const deleteabout = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedAbout = yield about_models_1.default.findByIdAndDelete(id);
    return deletedAbout;
});
exports.aboutService = {
    createabout,
    getAllabout,
    getaboutById,
    updateabout,
    deleteabout,
};
