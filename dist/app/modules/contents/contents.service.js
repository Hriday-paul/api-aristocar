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
exports.contentsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const contents_models_1 = __importDefault(require("./contents.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
// Create a new content
const createContents = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const { banner } = files;
        if (banner === null || banner === void 0 ? void 0 : banner.length) {
            const imgsArray = [];
            banner === null || banner === void 0 ? void 0 : banner.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/banner`,
                });
            }));
            payload.banner = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield contents_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content creation failed');
    }
    return result;
});
// Get all contents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllContents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ContentModel = new QueryBuilder_1.default(contents_models_1.default.find().populate(['createdBy']), query)
        .search(['createdBy'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield ContentModel.modelQuery;
    const meta = yield ContentModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get content by ID
const getContentsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_models_1.default.findById(id).populate(['createdBy']);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Content not found');
    }
    return result;
});
const deleteBanner = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield contents_models_1.default.findOne({});
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Content not found');
    }
    const result = yield contents_models_1.default.findByIdAndUpdate(content === null || content === void 0 ? void 0 : content._id, {
        $pull: { banner: { key: key } },
    }, { new: true });
    const newKey = [];
    newKey.push(`images/banner${key}`);
    if (newKey) {
        yield (0, s3_1.deleteManyFromS3)(newKey);
    }
    return result;
});
// Update content
const updateContents = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield contents_models_1.default.find({});
    if (!content.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Content not found');
    }
    const { deleteKey } = payload, updateData = __rest(payload, ["deleteKey"]);
    const update = Object.assign({}, updateData);
    if (files) {
        const { banner } = files;
        if (banner === null || banner === void 0 ? void 0 : banner.length) {
            const imgsArray = [];
            banner.map(b => imgsArray.push({
                file: b,
                path: `images/banner`,
            }));
            payload.banner = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    if (deleteKey && deleteKey.length > 0) {
        const newKey = [];
        deleteKey.map((key) => newKey.push(`images/banner${key}`));
        if ((newKey === null || newKey === void 0 ? void 0 : newKey.length) > 0) {
            yield (0, s3_1.deleteManyFromS3)(newKey);
        }
        yield contents_models_1.default.findByIdAndUpdate(content[0]._id, {
            $pull: { banner: { key: { $in: deleteKey } } },
        });
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.banner) && payload.banner.length > 0) {
        yield contents_models_1.default.findByIdAndUpdate(content[0]._id, {
            $push: { banner: { $each: payload.banner } },
        });
    }
    const result = yield contents_models_1.default.findByIdAndUpdate(content[0]._id, update, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content update failed');
    }
    return result;
});
// Delete content
const deleteContents = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content deletion failed');
    }
    return result;
});
exports.contentsService = {
    createContents,
    getAllContents,
    getContentsById,
    updateContents,
    deleteContents,
    deleteBanner,
};
