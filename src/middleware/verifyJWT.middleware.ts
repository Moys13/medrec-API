import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import responseApi from "../utils/response";

dotenv.config();

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json(
      responseApi("401", "Gagal menghubungkan", null, {
        message: "Akses token diperlukan",
      }),
    );

  const payload = verifyAccessToken(token);
  if (!payload)
    return res.status(401).json(
      responseApi("401", "Gagal menghubungkan", null, {
        message: "Akses token tidak valid",
      }),
    );

  (req as any).user = payload;
  next();
};

export default verifyJWT;
