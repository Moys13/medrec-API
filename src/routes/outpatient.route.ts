import express from "express";
import {
  createOutpatient,
  deleteOutpatient,
  getAllOutpatients,
  getOutpatientById,
  updateOutpatient,
} from "../controllers/outpatient.controllers";

const router = express.Router();

router.get("/", getAllOutpatients);
router.post("/", createOutpatient);

router.get("/:id", getOutpatientById);
router.patch("/:id", updateOutpatient);
router.delete("/:id", deleteOutpatient);

export default router;
