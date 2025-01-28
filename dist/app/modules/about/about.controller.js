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
exports.aboutController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const about_models_1 = __importDefault(require("./about.models"));
// Create About
const createabout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description } = req.body;
    const newAbout = yield about_models_1.default.create({ description });
    res.status(201).json({
        status: 'success',
        data: newAbout,
    });
}));
// Get All About
const getAllabout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aboutList = yield about_models_1.default.find();
    res.status(200).json({
        status: 'success',
        data: aboutList,
    });
}));
// Get About by ID
const getaboutById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const about = yield about_models_1.default.findById(id);
    if (!about) {
        return res.status(404).json({
            status: 'fail',
            message: 'About not found',
        });
    }
    res.status(200).json({
        status: 'success',
        data: about,
    });
}));
// Update About
const updateabout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description } = req.body;
    const updatedAbout = yield about_models_1.default.findByIdAndUpdate(id, { description }, { new: true });
    if (!updatedAbout) {
        return res.status(404).json({
            status: 'fail',
            message: 'About not found',
        });
    }
    res.status(200).json({
        status: 'success',
        data: updatedAbout,
    });
}));
// Delete About
const deleteabout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedAbout = yield about_models_1.default.findByIdAndDelete(id);
    if (!deletedAbout) {
        return res.status(404).json({
            status: 'fail',
            message: 'About not found',
        });
    }
    res.status(204).json({
        status: 'success',
        message: 'About record deleted successfully',
    });
}));
exports.aboutController = {
    createabout,
    getAllabout,
    getaboutById,
    updateabout,
    deleteabout,
};
