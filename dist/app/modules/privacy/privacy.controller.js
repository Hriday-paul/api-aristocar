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
exports.privacyController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const privacy_models_1 = __importDefault(require("./privacy.models"));
// Create Privacy
const createprivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description } = req.body;
    const newPrivacy = yield privacy_models_1.default.create({ description });
    res.status(201).json({
        status: 'success',
        data: newPrivacy,
    });
}));
// Get All Privacy
const getAllprivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const privacyList = yield privacy_models_1.default.find();
    res.status(200).json({
        status: 'success',
        data: privacyList,
    });
}));
// Get Privacy by ID
const getprivacyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const privacy = yield privacy_models_1.default.findById(id);
    if (!privacy) {
        return res.status(404).json({
            status: 'fail',
            message: 'Privacy not found',
        });
    }
    res.status(200).json({
        status: 'success',
        data: privacy,
    });
}));
// Update Privacy
const updateprivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description } = req.body;
    const updatedPrivacy = yield privacy_models_1.default.findByIdAndUpdate(id, { description }, { new: true });
    if (!updatedPrivacy) {
        return res.status(404).json({
            status: 'fail',
            message: 'Privacy not found',
        });
    }
    res.status(200).json({
        status: 'success',
        data: updatedPrivacy,
    });
}));
// Delete Privacy
const deleteprivacy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedPrivacy = yield privacy_models_1.default.findByIdAndDelete(id);
    if (!deletedPrivacy) {
        return res.status(404).json({
            status: 'fail',
            message: 'Privacy not found',
        });
    }
    res.status(204).json({
        status: 'success',
        message: 'Privacy record deleted successfully',
    });
}));
exports.privacyController = {
    createprivacy,
    getAllprivacy,
    getprivacyById,
    updateprivacy,
    deleteprivacy,
};
