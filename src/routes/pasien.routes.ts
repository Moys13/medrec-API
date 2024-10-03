import express from "express";
import {
  createPasien,
  getAllPasien,
  rekamMedis,
} from "../controllers/pasien.controllers";

const router = express.Router();

router.get("/", getAllPasien);
router.post("/", createPasien);

router.get("/:id?/rekam-medis", rekamMedis);

export default router;
