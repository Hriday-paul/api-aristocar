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
exports.contactController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const contact_service_1 = require("./contact.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createcontact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    req.body.userId = userId;
    // console.log('======', req.body);
    const result = yield contact_service_1.contactService.createContact(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
}));
const getAllcontact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_service_1.contactService.getAllcontact(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Contacts retrieved successfully',
        data: result,
    });
}));
const getcontactById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contact_service_1.contactService.getcontactById(id);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: 'Contact not found',
            data: {},
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Contact retrieved successfully',
            data: result,
        });
    }
}));
const getcontactByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield contact_service_1.contactService.getcontactByUserId(userId);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: 'Contact not found',
            data: {},
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Contact retrieved successfully',
            data: result,
        });
    }
}));
const updatecontact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contact_service_1.contactService.updatecontact(id, req.body);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: 'Contact not found to update',
            data: {},
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Contact updated successfully',
            data: result,
        });
    }
}));
const deletecontact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contact_service_1.contactService.deletecontact(id);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: 'Contact not found to delete',
            data: {},
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Contact deleted successfully',
            data: result,
        });
    }
}));
exports.contactController = {
    createcontact,
    getAllcontact,
    getcontactById,
    updatecontact,
    deletecontact,
    getcontactByUserId,
};
