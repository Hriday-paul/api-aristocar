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
exports.dealerContactController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const dealerContact_service_1 = require("./dealerContact.service");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createdealerContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dealerContact_service_1.dealerContactService.createdealerContact(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Message send successfully',
        data: result,
    });
}));
const getAlldealerContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dealerContact_service_1.dealerContactService.getAlldealerContact(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Contacts retrieved successfully',
        data: result,
    });
}));
const getdealerContactById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield dealerContact_service_1.dealerContactService.getdealerContactById(id);
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
const getDealerContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const count = yield dealerContact_service_1.dealerContactService.getDealerContact(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User created cars count retrieved successfully',
        data: count,
    });
}));
const updatedealerContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield dealerContact_service_1.dealerContactService.updatedealerContact(id, req.body);
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
const deletedealerContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield dealerContact_service_1.dealerContactService.deletedealerContact(id);
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
exports.dealerContactController = {
    createdealerContact,
    getAlldealerContact,
    getdealerContactById,
    updatedealerContact,
    deletedealerContact,
    getDealerContact,
};
