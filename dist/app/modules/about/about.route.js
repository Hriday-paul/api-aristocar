"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aboutRoutes = void 0;
const express_1 = require("express");
const about_controller_1 = require("./about.controller");
const router = (0, express_1.Router)();
// Create About
router.post('/create-about', about_controller_1.aboutController.createabout);
// Update About
router.patch('/update/:id', about_controller_1.aboutController.updateabout);
// Delete About
// router.delete('/:id', aboutController.deleteabout);
// Get About by ID
router.get('/:id', about_controller_1.aboutController.getaboutById);
// Get All About
// router.get('/', aboutController.getAllabout);
exports.aboutRoutes = router;
