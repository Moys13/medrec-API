"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const outpatient_controllers_1 = require("../controllers/outpatient.controllers");
const router = express_1.default.Router();
router.get("/", outpatient_controllers_1.getAllOutpatients);
router.post("/", outpatient_controllers_1.createOutpatient);
router.get("/:id", outpatient_controllers_1.getOutpatientById);
router.patch("/:id", outpatient_controllers_1.updateOutpatient);
router.delete("/:id", outpatient_controllers_1.deleteOutpatient);
exports.default = router;
//# sourceMappingURL=outpatient.route.js.map