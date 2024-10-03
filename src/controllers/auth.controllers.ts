import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import responseApi from "../utils/response";

const prisma = new PrismaClient();

export const userLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      jabatan: {
        select: {
          namaJabatan: true,
        },
      },
    },
  });
  if (!user)
    return res.status(401).json(
      responseApi("401", "Tidak ada akses masuk", null, {
        message: "Akun tidak terdaftar",
      }),
    );

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json(
      responseApi("401", "Tidak ada akses masuk", {
        message: "Username atau password salah",
      }),
    );

  const accessToken = generateAccessToken({
    id: user.id,
    namaLengkap: user.namaLengkap,
    jabatan: user.jabatan.namaJabatan,
  });
  const refreshToken = generateRefreshToken({
    id: user.id,
    namaLengkap: user.namaLengkap,
    jabatan: user.jabatan.namaJabatan,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.json(
    responseApi("200", "Berhasil masuk", { accessToken, refreshToken }, null),
  );
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json(
      responseApi("401", "Tidak ada akses", null, {
        message: "Tidak ada refresh token tersedia",
      }),
    );

  const payload = verifyRefreshToken(refreshToken);
  if (!payload)
    return res.status(401).json(
      responseApi("401", "Tidak ada akses", null, {
        message: "Refresh token tidak valid",
      }),
    );

  const user = await prisma.user.findUnique({
    where: {
      id: (payload as { id: number }).id,
    },
    include: {
      jabatan: {
        select: {
          namaJabatan: true,
        },
      },
    },
  });

  if (!user || user.refreshToken !== refreshToken)
    return res.status(401).json(
      responseApi("401", "Tidak ada akses", null, {
        message:
          "tidak ada user yang ditemukan atau atau refresh token kadaluarsa",
      }),
    );

  const newAccessToken = generateAccessToken({
    id: user.id,
    namaLengkap: user.namaLengkap,
    jabatan: user.jabatan.namaJabatan,
  });

  res.cookie("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.status(204).send();
};

export const userLogout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  await prisma.user.update({
    where: { refreshToken },
    data: { refreshToken: null },
  });

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json(responseApi("200", "Berhasil logout", null, null));
};
