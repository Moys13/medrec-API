import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import responseApi from "../utils/response";
import normAuto from "../utils/normauto";
import { dateHandle } from "../utils/date";

export interface patientRequest {
  idIdentitas: string;
  wna: string;
  namaLengkap: string;
  tglLahir: string;
  tmptLahir: string;
  jenisKelamin: string;
  alamat: string;
  pekerjaan: string;
  pernikahan: string;
  agama: string;
  golDarah: string;
  rt: string;
  rw: string;
  provinsi: string;
  kelurahan: string;
  kecamatan: string;
  pendidikan: string;
  noTlp: string;
  noAsuransi: string;
  ibuKandung: string;
}

const prisma = new PrismaClient();

export const getAllPatients = async (req: Request, res: Response) => {
  const userRole = req.user.jabatan;

  if (userRole === "Admin" || userRole === "Staff Rekam Medis") {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const norm = req.query.norm as string;

      if (norm) {
        const data = await prisma.pasien.findUnique({
          where: {
            noRm: norm,
          },
        });
        if (!data)
          return res.status(404).json(
            responseApi<null>("404", "Data tidak ditemukan", null, {
              message: "Data yang anda cari tidak ada atau salah penginputan",
            }),
          );
        console.log(req.user);
        return res
          .status(200)
          .json(
            responseApi<typeof data>("200", "Berhasil mengambil data", data),
          );
      }

      const skip = (page - 1) * limit;
      const take = limit;

      const { startDate, endDate } = dateHandle(
        req.query.startDate as string,
        req.query.endDate as string,
      );

      const data = await prisma.pasien.findMany({
        skip: skip,
        take: take,
        where: {
          tglDaftar: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalPatient = await prisma.pasien.count({
        where: {
          tglDaftar: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalPages = Math.ceil(totalPatient / limit);

      if (data.length === 0)
        return res.status(404).json(
          responseApi<null>("404", "Gagal mengambil data", null, null, {
            message: "Tidak ada data yang tersedia",
          }),
        );
      res.json(
        responseApi<typeof data>(
          "200",
          "Berhasil mengambil semua data pasien",
          data,
          null,
          {
            totalPatient,
            totalPages,
            currentPage: page,
            limit: limit,
            startDate,
            endDate,
          },
        ),
      );
    } catch (error: any) {
      res.status(500).json(
        responseApi<null>("500", "Tidak dapat mengambil data", null, {
          message: error.message,
        }),
      );
    }
  }
  return res.status(401).json(
    responseApi("401", "Tidak dapat mengambil data pasien", null, {
      message: "User tidak memiliki akses untuk melihat data pasien",
    }),
  );
};

export const createPatient = async (req: Request, res: Response) => {
  const userRole = req.user.jabatan;

  if (userRole === "Admin" || userRole === "Staff Rekam Medis") {
    const data: patientRequest = req.body;
    const norm = await normAuto();
    try {
      const addPatient = await prisma.pasien.create({
        data: {
          noRm: norm,
          ...data,
        },
      });
      res.status(200).json(
        responseApi<typeof addPatient>(
          "200",
          "Berhasil menambahkan data pasien",
          addPatient,
          null,
          {
            rekamMedis: `/`,
          },
        ),
      );
    } catch (error: any) {
      res
        .status(500)
        .json(
          responseApi(
            "500",
            "Terjadi kesalahan saat menyimpan data",
            null,
            error.message,
          ),
        );
    }
  }
  return res.status(401).json(
    responseApi("401", "Tidak dapat mengambil data pasien", null, {
      message: "User tidak memiliki akses untuk melihat data pasien",
    }),
  );
};

export const medicalRecords = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    const date = new Date().toLocaleDateString();
    const { startDate, endDate } = dateHandle(date, date);

    try {
      const totalPatient = await prisma.pasien.count();
      const patientToday = await prisma.pasien.count({
        where: {
          tglDaftar: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      const totalOutpatients = await prisma.rawatJalan.count();
      const outpatientTodays = await prisma.rawatJalan.count({
        where: {
          tanggalMasuk: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return res.status(200).json(
        responseApi<object>(
          "200",
          "Berhasil mengambil semua data rekam medis",
          {
            totalPatient,
            patientToday,
            totalOutpatients,
            outpatientTodays,
          },
          null,
          {
            pasienTotalLink: `/pasien`,
            pasienTodayLink: `/pasien?startDate=${date.replace(/\//g, "-")}&endDate=${date.replace(/\//g, "-")}`,
          },
        ),
      );
    } catch (error: any) {
      return res.status(500).json(
        responseApi<null>(
          "500",
          "Gagal mengambil data semua rekam medis",
          null,
          {
            message: error.message,
          },
        ),
      );
    }
  }

  try {
    const idNumber = parseInt(id);

    const date = new Date().toLocaleDateString();
    const { startDate, endDate } = dateHandle(date, date);

    const medrec = await prisma.pasien.findMany({
      where: {
        id: idNumber,
      },
      include: {
        rawatJalan: true,
      },
    });
    if (!medrec)
      return res.status(404).json(
        responseApi<null>(
          "404",
          "Gagal mengambil data rekam medis pasien",
          null,
          {
            message: "Pasien tidak ditemukan",
          },
        ),
      );

    const totalOutpatientVisits = await prisma.rawatJalan.count({
      where: {
        idPasien: idNumber,
      },
    });

    const outpatientVisitsToday = await prisma.rawatJalan.count({
      where: {
        idPasien: idNumber,
        tanggalMasuk: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return res.status(200).json(
      responseApi(
        "200",
        "Berhasil mengambil data rekam medis pasien",
        medrec,
        null,
        {
          totalOutpatientVisits,
          outpatientVisitsToday,
        },
      ),
    );
  } catch (error: any) {
    return res.status(500).json(
      responseApi<null>(
        "500",
        "Gagal mengambil data rekam medis pasien",
        null,
        {
          message: error.message,
        },
      ),
    );
  }
};
