import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { dateHandle } from "../utils/date";
import responseApi from "../utils/response";

const prisma = new PrismaClient();

export const getAllOutpatients = async (req: Request, res: Response) => {
  const queryStartDate =
    (req.query.startDate as string) || new Date().toLocaleDateString();
  const queryEndDate =
    (req.query.endDate as string) || new Date().toLocaleDateString();
  const { startDate, endDate } = dateHandle(queryStartDate, queryEndDate);

  const page = parseInt(req.query.page as string) | 1;
  const limit = parseInt(req.query.limit as string) | 10;
  const skip = (page - 1) * limit;
  const take = limit;

  const norm = req.query.norm as string;

  try {
    const outpatient = await prisma.rawatJalan.findMany({
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

    const totalOutPatient = await prisma.rawatJalan.count({
      where: {
        tanggalMasuk: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalPages = Math.ceil(totalOutPatient / limit);

    if (!outpatient)
      return res.status(404).json(
        responseApi<null>("404", "Gagal mengambil data rawat jalan", null, {
          message: "Data pasien tidak ada atau tidak ditemukan",
        }),
      );

    return res.status(200).json(
      responseApi<typeof outpatient>(
        "200",
        "Berhasil mengambil data rawat jalan",
        outpatient,
        null,
        {
          totalOutPatient,
          totalPages,
          currentPage: page,
          limit: limit,
          startDate,
          endDate,
        },
      ),
    );
  } catch (error: any) {
    return res.status(500).json(
      responseApi<null>(
        "500",
        "Terjadi kesalahan saat mengambil data rawat jalan",
        null,
        {
          message: error.message,
        },
      ),
    );
  }
};

export const createOutpatient = async (req: Request, res: Response) => {
  const role = req.user.jabatan;

  if (role !== "Staff Rekam Medis" && role !== "Admin")
    return res.status(401).json(
      responseApi<null>("401", "Akses ditolak", null, {
        message: "Tidak dapat menyimpan data karena anda tidak ada hak akses",
      }),
    );

  const { idPasien, ...outpatientData } = req.body;

  try {
    const addOutpatient = await prisma.rawatJalan.create({
      data: {
        ...outpatientData,
        pasien: {
          connect: { id: idPasien },
        },
      },
    });
    return res
      .status(200)
      .json(
        responseApi<typeof addOutpatient>(
          "200",
          "Berhasil menambahkan data rawat jalan",
          addOutpatient,
        ),
      );
  } catch (error: any) {
    return res.status(500).json(
      responseApi<null>("500", "Tidak dapat menyimpan data rawat jalan", null, {
        message: error.message,
      }),
    );
  }
};

export const getOutpatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const outpatient = await prisma.rawatJalan.findUnique({
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
      return res.status(404).json(
        responseApi<null>(
          "404",
          "Tidak dapat mengambil data rawat jalan",
          null,
          {
            message: `Data dengan id ${id} tidak di temukan`,
          },
        ),
      );
    return res.status(200).json(
      responseApi<typeof outpatient>(
        "200",
        "Berhasil mengambil data rawat jalan",
        outpatient,
        null,
        {
          patientLink: `/pasien/${outpatient.idPasien}/rekam-medis`,
        },
      ),
    );
  } catch (error: any) {
    res.status(500).json(
      responseApi("500", "Tidak dapat mengambil data Rawat Jalan", null, {
        message: error.message,
      }),
    );
  }
};

export const deleteOutpatient = async (req: Request, res: Response) => {
  const role = req.user.jabatan;

  if (role !== "Admin")
    return res.status(401).json(
      responseApi<null>("401", "Akses ditolak", null, {
        message: "Tidak dapat menghapus data karena anda tidak ada hak akses",
      }),
    );

  const { id } = req.params;

  try {
    const outpatient = await prisma.rawatJalan.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!outpatient)
      return res.status(404).json(
        responseApi<null>("404", "Tidak dapat menghapus data", null, {
          message: `Data dengan id ${id} tidak di temukan atau mungkin sudah di hapus`,
        }),
      );

    const deleteOutpatient = await prisma.rawatJalan.delete({
      where: {
        id: Number(id),
      },
    });
    return res
      .status(200)
      .json(
        responseApi<typeof outpatient>(
          "200",
          "Berhasil mehapus data",
          deleteOutpatient,
          null,
          null,
        ),
      );
  } catch (error: any) {
    res.status(500).json(
      responseApi("500", "Tidak dapat mengambil data Rawat Jalan", null, {
        message: error.message,
      }),
    );
  }
};

export const updateOutpatient = async (req: Request, res: Response) => {
  const role = req.user.jabatan;

  if (role !== "Admin")
    return res.status(401).json(
      responseApi<null>("401", "Akses ditolak", null, {
        message: "Tidak dapat menghapus data karena anda tidak ada hak akses",
      }),
    );

  try {
    const { id } = req.params;

    const outpatient = await prisma.rawatJalan.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!outpatient)
      return res.status(404).json(
        responseApi<null>("404", "Tidak dapat edit data", null, {
          message: `Data dengan id ${id} tidak di temukan atau mungkin sudah di hapus`,
        }),
      );

    const { keluhan, kode } = req.body;

    const updateOutpatient = await prisma.rawatJalan.update({
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
      .json(
        responseApi<typeof outpatient>(
          "200",
          "Berhasil edit data",
          updateOutpatient,
          null,
          null,
        ),
      );
  } catch (error: any) {
    res.status(500).json(
      responseApi("500", "Tidak dapat mengambil data Rawat Jalan", null, {
        message: error.message,
      }),
    );
  }
};
