"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUpload = (uploadDirectory) => {
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDirectory);
        },
        filename: function (req, file, cb) {
            const parts = file.originalname.split('.');
            let extenson;
            if (parts.length > 1) {
                extenson = '.' + parts.pop();
            }
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, parts.shift().replace(/\s+/g, '_') + '-' + uniqueSuffix + extenson);
        },
    });
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: function (req, file, cb) {
            if (file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/svg' ||
                file.mimetype === 'image/webp' ||
                file.mimetype === 'application/octet-stream' ||
                file.mimetype === 'image/svg+xml') {
                cb(null, true);
            }
            else {
                cb(null, false);
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'only png,jpg,jpeg,svg format allowed');
            }
        },
    });
    return upload;
};
exports.default = fileUpload;
