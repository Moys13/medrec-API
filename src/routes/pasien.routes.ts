import express from "express";
import {
  createPatient,
  getAllPatients,
  medicalRecords,
} from "../controllers/patient.controllers";

const router = express.Router();

router.get("/", getAllPatients);
router.post("/", createPatient);

router.get("/:id?/rekam-medis", medicalRecords);

export default router;
