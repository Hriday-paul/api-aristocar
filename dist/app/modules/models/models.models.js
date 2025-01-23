"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ModelSchema = new mongoose_1.default.Schema({
    modelName: {
        type: String,
        required: true,
    },
    brandId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'brand',
        required: true,
    },
});
const Model = mongoose_1.default.model('Model', ModelSchema);
exports.default = Model;
