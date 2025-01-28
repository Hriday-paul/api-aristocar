"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRoutes = void 0;
const express_1 = require("express");
const invoice_controller_1 = require("./invoice.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(user_constants_1.USER_ROLE.dealer), invoice_controller_1.invoiceController.createInvoice);
router.patch('/update/:id', invoice_controller_1.invoiceController.updateInvoice);
router.delete('/delete/:id', invoice_controller_1.invoiceController.deleteInvoice);
router.get('/:id', invoice_controller_1.invoiceController.getInvoiceById);
router.get('/', invoice_controller_1.invoiceController.getAllInvoices);
exports.invoiceRoutes = router;
