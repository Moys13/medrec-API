"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecords = exports.addPatient = exports.getAllPatients = void 0;
const response_1 = __importDefault(require("../utils/response"));
const normauto_1 = __importDefault(require("../utils/normauto"));
const date_1 = require("../utils/date");
const prisma_1 = require("../utils/prisma");
const getAllPatients = async (req, res) => {
    const userRole = req.user.jabatan;
    if (userRole !== "Admin" && userRole !== "Staff Rekam Medis") {
        return res.status(401).json((0, response_1.default)("401", "Tidak dapat mengambil data pasien", null, {
            message: "User tidak memiliki akses untuk melihat data pasien",
        }));
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const norm = req.query.norm;
        if (norm) {
            const data = await prisma_1.prisma.pasien.findUnique({
                where: {
                    noRm: norm,
                },
            });
            if (!data)
                return res.status(404).json((0, response_1.default)("404", "Data tidak ditemukan", null, {
                    message: "Data yang anda cari tidak ada atau salah penginputan",
                }));
            return res
                .status(200)
                .json((0, response_1.default)("200", "Berhasil mengambil data", data));
        }
        const skip = (page - 1) * limit;
        const take = limit;
        const { startDate, endDate } = (0, date_1.dateHandle)(req.query.startDate, req.query.endDate);
        const data = await prisma_1.prisma.pasien.findMany({
            skip: skip,
            take: take,
            where: {
                tglDaftar: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalPatient = await prisma_1.prisma.pasien.count({
            where: {
                tglDaftar: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalPages = Math.ceil(totalPatient / limit);
        if (data.length === 0)
            return res.status(404).json((0, response_1.default)("404", "Gagal mengambil data", null, null, {
                message: "Tidak ada data yang tersedia",
            }));
        return res.json((0, response_1.default)("200", "Berhasil mengambil semua data pasien", data, null, {
            totalPatient,
            totalPages,
            currentPage: page,
            limit: limit,
            startDate,
            endDate,
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.default)("500", "Tidak dapat mengambil data", null, {
            message: error.message,
        }));
    }
};
exports.getAllPatients = getAllPatients;
const addPatient = async (req, res) => {
    const role = req.user.jabatan;
    if (role !== "Admin" && role !== "Staff Rekam Medis") {
        return res.status(401).json((0, response_1.default)("401", "Tidak dapat menambahkan data pasien", null, {
            message: "User tidak memiliki akses untuk menambahkan data pasien",
        }));
    }
    const data = req.body;
    const norm = await (0, normauto_1.default)();
    try {
        const addPatient = await prisma_1.prisma.pasien.create({
            data: {
                noRm: norm,
                ...data,
            },
        });
        return res.status(200).json((0, response_1.default)("200", "Berhasil menambahkan data pasien", addPatient, null, {
            rekamMedis: `/`,
        }));
    }
    catch (error) {
        return res
            .status(500)
            .json((0, response_1.default)("500", "Terjadi kesalahan saat menyimpan data", null, error.message));
    }
};
exports.addPatient = addPatient;
const medicalRecords = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        const date = new Date().toLocaleDateString();
        const { startDate, endDate } = (0, date_1.dateHandle)(date, date);
        try {
            const totalPatient = await prisma_1.prisma.pasien.count();
            const patientToday = await prisma_1.prisma.pasien.count({
                where: {
                    tglDaftar: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const totalOutpatients = await prisma_1.prisma.rawatJalan.count();
            const outpatientTodays = await prisma_1.prisma.rawatJalan.count({
                where: {
                    tanggalMasuk: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            return res.status(200).json((0, response_1.default)("200", "Berhasil mengambil semua data rekam medis", {
                totalPatient,
                patientToday,
                totalOutpatients,
                outpatientTodays,
            }, null, {
                pasienTotalLink: `/pasien`,
                pasienTodayLink: `/pasien?startDate=${date.replace(/\//g, "-")}&endDate=${date.replace(/\//g, "-")}`,
            }));
        }
        catch (error) {
            return res.status(500).json((0, response_1.default)("500", "Gagal mengambil data semua rekam medis", null, {
                message: error.message,
            }));
        }
    }
    try {
        const idNumber = parseInt(id);
        const date = new Date().toLocaleDateString();
        const { startDate, endDate } = (0, date_1.dateHandle)(date, date);
        const medrec = await prisma_1.prisma.pasien.findMany({
            where: {
                id: idNumber,
            },
            include: {
                rawatJalan: true,
            },
        });
        if (!medrec)
            return res.status(404).json((0, response_1.default)("404", "Gagal mengambil data rekam medis pasien", null, {
                message: "Pasien tidak ditemukan",
            }));
        const totalOutpatientVisits = await prisma_1.prisma.rawatJalan.count({
            where: {
                idPasien: idNumber,
            },
        });
        const outpatientVisitsToday = await prisma_1.prisma.rawatJalan.count({
            where: {
                idPasien: idNumber,
                tanggalMasuk: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        return res.status(200).json((0, response_1.default)("200", "Berhasil mengambil data rekam medis pasien", medrec, null, {
            totalOutpatientVisits,
            outpatientVisitsToday,
        }));
    }
    catch (error) {
        return res.status(500).json((0, response_1.default)("500", "Gagal mengambil data rekam medis pasien", null, {
            message: error.message,
        }));
    }
};
exports.medicalRecords = medicalRecords;
//# sourceMappingURL=patient.controllers.js.map