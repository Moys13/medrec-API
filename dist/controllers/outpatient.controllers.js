"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOutpatient = exports.deleteOutpatient = exports.getOutpatientById = exports.createOutpatient = exports.getAllOutpatients = void 0;
const date_1 = require("../utils/date");
const response_1 = __importDefault(require("../utils/response"));
const prisma_1 = require("../utils/prisma");
const getAllOutpatients = async (req, res) => {
    const queryStartDate = req.query.startDate || new Date().toLocaleDateString();
    const queryEndDate = req.query.endDate || new Date().toLocaleDateString();
    const { startDate, endDate } = (0, date_1.dateHandle)(queryStartDate, queryEndDate);
    const page = parseInt(req.query.page) | 1;
    const limit = parseInt(req.query.limit) | 10;
    const skip = (page - 1) * limit;
    const take = limit;
    const norm = req.query.norm;
    try {
        const outpatient = await prisma_1.prisma.rawatJalan.findMany({
            skip: skip,
            take: take,
            where: {
                pasien: {
                    noRm: norm,
                },
                tanggalMasuk: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                pasien: {
                    select: {
                        noRm: true,
                        namaLengkap: true,
                    },
                },
            },
        });
        const totalOutPatient = await prisma_1.prisma.rawatJalan.count({
            where: {
                tanggalMasuk: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalPages = Math.ceil(totalOutPatient / limit);
        if (!outpatient)
            return res.status(404).json((0, response_1.default)("404", "Gagal mengambil data rawat jalan", null, {
                message: "Data pasien tidak ada atau tidak ditemukan",
            }));
        return res.status(200).json((0, response_1.default)("200", "Berhasil mengambil data rawat jalan", outpatient, null, {
            totalOutPatient,
            totalPages,
            currentPage: page,
            limit: limit,
            startDate,
            endDate,
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.default)("500", "Terjadi kesalahan saat mengambil data rawat jalan", null, {
            message: error.message,
        }));
    }
};
exports.getAllOutpatients = getAllOutpatients;
const createOutpatient = async (req, res) => {
    const role = req.user.jabatan;
    if (role !== "Staff Rekam Medis" && role !== "Admin")
        return res.status(401).json((0, response_1.default)("401", "Akses ditolak", null, {
            message: "Tidak dapat menyimpan data karena anda tidak ada hak akses",
        }));
    const { idPasien, ...outpatientData } = req.body;
    try {
        const addOutpatient = await prisma_1.prisma.rawatJalan.create({
            data: {
                ...outpatientData,
                pasien: {
                    connect: { id: idPasien },
                },
            },
        });
        return res
            .status(200)
            .json((0, response_1.default)("200", "Berhasil menambahkan data rawat jalan", addOutpatient));
    }
    catch (error) {
        return res.status(500).json((0, response_1.default)("500", "Tidak dapat menyimpan data rawat jalan", null, {
            message: error.message,
        }));
    }
};
exports.createOutpatient = createOutpatient;
const getOutpatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const outpatient = await prisma_1.prisma.rawatJalan.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                pasien: {
                    select: {
                        id: true,
                        noRm: true,
                        idIdentitas: true,
                        wna: true,
                        namaLengkap: true,
                        jenisKelamin: true,
                        golDarah: true,
                        noAsuransi: true,
                        noTlp: true,
                    },
                },
            },
        });
        if (!outpatient)
            return res.status(404).json((0, response_1.default)("404", "Tidak dapat mengambil data rawat jalan", null, {
                message: `Data dengan id ${id} tidak di temukan`,
            }));
        return res.status(200).json((0, response_1.default)("200", "Berhasil mengambil data rawat jalan", outpatient, null, {
            patientLink: `/pasien/${outpatient.idPasien}/rekam-medis`,
        }));
    }
    catch (error) {
        res.status(500).json((0, response_1.default)("500", "Tidak dapat mengambil data Rawat Jalan", null, {
            message: error.message,
        }));
    }
};
exports.getOutpatientById = getOutpatientById;
const deleteOutpatient = async (req, res) => {
    const role = req.user.jabatan;
    if (role !== "Admin")
        return res.status(401).json((0, response_1.default)("401", "Akses ditolak", null, {
            message: "Tidak dapat menghapus data karena anda tidak ada hak akses",
        }));
    const { id } = req.params;
    try {
        const outpatient = await prisma_1.prisma.rawatJalan.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!outpatient)
            return res.status(404).json((0, response_1.default)("404", "Tidak dapat menghapus data", null, {
                message: `Data dengan id ${id} tidak di temukan atau mungkin sudah di hapus`,
            }));
        const deleteOutpatient = await prisma_1.prisma.rawatJalan.delete({
            where: {
                id: Number(id),
            },
        });
        return res
            .status(200)
            .json((0, response_1.default)("200", "Berhasil mehapus data", deleteOutpatient, null, null));
    }
    catch (error) {
        res.status(500).json((0, response_1.default)("500", "Tidak dapat mengambil data Rawat Jalan", null, {
            message: error.message,
        }));
    }
};
exports.deleteOutpatient = deleteOutpatient;
const updateOutpatient = async (req, res) => {
    const role = req.user.jabatan;
    if (role !== "Admin")
        return res.status(401).json((0, response_1.default)("401", "Akses ditolak", null, {
            message: "Tidak dapat menghapus data karena anda tidak ada hak akses",
        }));
    try {
        const { id } = req.params;
        const outpatient = await prisma_1.prisma.rawatJalan.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!outpatient)
            return res.status(404).json((0, response_1.default)("404", "Tidak dapat edit data", null, {
                message: `Data dengan id ${id} tidak di temukan atau mungkin sudah di hapus`,
            }));
        const { keluhan, kode } = req.body;
        const updateOutpatient = await prisma_1.prisma.rawatJalan.update({
            where: {
                id: Number(id),
            },
            data: {
                keluhan: keluhan,
                kode: kode,
            },
        });
        return res
            .status(200)
            .json((0, response_1.default)("200", "Berhasil edit data", updateOutpatient, null, null));
    }
    catch (error) {
        res.status(500).json((0, response_1.default)("500", "Tidak dapat mengambil data Rawat Jalan", null, {
            message: error.message,
        }));
    }
};
exports.updateOutpatient = updateOutpatient;
//# sourceMappingURL=outpatient.controllers.js.map