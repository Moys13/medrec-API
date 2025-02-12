"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.refreshToken = exports.userLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const response_1 = __importDefault(require("../utils/response"));
const prisma_1 = require("../utils/prisma");
const userLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({
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
        return res.status(401).json((0, response_1.default)("401", "Tidak ada akses masuk", null, {
            message: "Akun tidak terdaftar",
        }));
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(401).json((0, response_1.default)("401", "Tidak ada akses masuk", {
            message: "Username atau password salah",
        }));
    const accessToken = (0, jwt_1.generateAccessToken)({
        id: user.id,
        namaLengkap: user.namaLengkap,
        jabatan: user.jabatan.namaJabatan,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
        id: user.id,
        namaLengkap: user.namaLengkap,
        jabatan: user.jabatan.namaJabatan,
    });
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.json((0, response_1.default)("200", "Berhasil masuk", { accessToken, refreshToken }, null));
};
exports.userLogin = userLogin;
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)
        return res.status(401).json((0, response_1.default)("401", "Tidak ada akses", null, {
            message: "Tidak ada refresh token tersedia",
        }));
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!payload)
        return res.status(401).json((0, response_1.default)("401", "Tidak ada akses", null, {
            message: "Refresh token tidak valid",
        }));
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: payload.id,
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
        return res.status(401).json((0, response_1.default)("401", "Tidak ada akses", null, {
            message: "tidak ada user yang ditemukan atau atau refresh token kadaluarsa",
        }));
    const newAccessToken = (0, jwt_1.generateAccessToken)({
        id: user.id,
        namaLengkap: user.namaLengkap,
        jabatan: user.jabatan.namaJabatan,
    });
    res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 1000,
    });
    res.status(204).send();
};
exports.refreshToken = refreshToken;
const userLogout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        await prisma_1.prisma.user.update({
            where: { refreshToken },
            data: { refreshToken: null },
        });
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.json((0, response_1.default)("200", "Berhasil logout", null, null));
    }
    catch (error) {
        res.json((0, response_1.default)("500", "Tidak dapat logout", null, {
            message: error.message,
        }));
    }
};
exports.userLogout = userLogout;
//# sourceMappingURL=auth.controllers.js.map