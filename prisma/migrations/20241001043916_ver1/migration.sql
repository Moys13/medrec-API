-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "id_jabatan" INTEGER NOT NULL,
    "refresh_token" TEXT,
    "tgl_buat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tgl_edit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id" SERIAL NOT NULL,
    "nama_jabatan" VARCHAR(20) NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rawat_jalan" (
    "id" SERIAL NOT NULL,
    "id_pasien" INTEGER NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL,
    "keluhan" TEXT NOT NULL,
    "kode" VARCHAR(10) NOT NULL,

    CONSTRAINT "rawat_jalan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pasien" (
    "id" SERIAL NOT NULL,
    "no_rm" VARCHAR(15) NOT NULL,
    "id_identitas" TEXT NOT NULL,
    "wna" VARCHAR(3) DEFAULT 'WNI',
    "nama_lengkap" VARCHAR(50) NOT NULL,
    "jenis_kelamin" VARCHAR(10) NOT NULL,
    "tgl_lahir" TIMESTAMP(3) NOT NULL,
    "tmpt_lahir" VARCHAR(50) NOT NULL,
    "agama" VARCHAR(10) NOT NULL,
    "alamat" VARCHAR(50) NOT NULL,
    "provinsi" VARCHAR(30) NOT NULL,
    "rt" VARCHAR(3) NOT NULL,
    "rw" VARCHAR(3) NOT NULL,
    "kecamatan" VARCHAR(20) NOT NULL,
    "kelurahan" VARCHAR(20) NOT NULL,
    "pekerjaan" VARCHAR(20) NOT NULL,
    "pernikahan" VARCHAR(15) NOT NULL,
    "pendidikan" VARCHAR(10) NOT NULL,
    "gol_darah" VARCHAR(2) NOT NULL,
    "no_asuransi" VARCHAR(15) NOT NULL,
    "ibu_kandung" VARCHAR(20) NOT NULL,
    "no_tlp" VARCHAR(12) NOT NULL,
    "tgl_daftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tgl_edit" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_jabatan_key" ON "user"("id_jabatan");

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_token_key" ON "user"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_nama_jabatan_key" ON "jabatan"("nama_jabatan");

-- CreateIndex
CREATE UNIQUE INDEX "pasien_no_rm_key" ON "pasien"("no_rm");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rawat_jalan" ADD CONSTRAINT "rawat_jalan_id_pasien_fkey" FOREIGN KEY ("id_pasien") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
