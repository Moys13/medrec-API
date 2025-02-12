import express from "express";
import {
  addPatient,
  getAllPatients,
  medicalRecords,
} from "../controllers/patient.controllers";

const router = express.Router();

router.get("/", getAllPatients);
router.post("/", addPatient);

router.get("/:id?/rekam-medis", medicalRecords);

export default router;
