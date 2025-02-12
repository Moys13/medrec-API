"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controllers_1 = require("../controllers/patient.controllers");
const router = express_1.default.Router();
router.get("/", patient_controllers_1.getAllPatients);
router.post("/", patient_controllers_1.addPatient);
router.get("/:id?/rekam-medis", patient_controllers_1.medicalRecords);
exports.default = router;
//# sourceMappingURL=patient.routes.js.map