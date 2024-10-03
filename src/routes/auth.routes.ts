import express from "express";
import {
  refreshToken,
  userLogin,
  userLogout,
} from "../controllers/auth.controllers";
import verifyJWT from "../middleware/verifyJWT.middleware";

const router = express.Router();

router.post("/login", userLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", userLogout);

export default router;
