"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueInvoiceNumber = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateUniqueInvoiceNumber = () => {
    const timestamp = Date.now().toString(); // Get current timestamp
    const randomString = crypto_1.default.randomBytes(3).toString('hex'); // Generate random 6-character string
    return `INV-${timestamp}-${randomString}`; // Combine to create unique invoice number
};
exports.generateUniqueInvoiceNumber = generateUniqueInvoiceNumber;
