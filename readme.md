# Aplikasi Backend API Rekam Medis

Aplikasi ini adalah aplikasi sederhana backend rekam medis, aplikasi bertujuan untuk melakukan mengirim data, menerima data, serta modifikasi data.

Aplikasi ini dibuat menggunakan bahasa pemrograman **TypeScript** dan menggunakan beberapa dependencies pendukung di antaranya:

- Prisma 6.0.1
- cors 2.8.17
- bcryptjs 2.4.3
- cookie-parser 1.4.7
- cors 2.8.5
- dotenv 16.4.7
- express 4.21.2
- jsonwebtoken 9.0.2

## route pada API

#### /api/auth

route ini untuk melakukan login dan logout serta refresh token

##### /api/auth/login

Route untuk login ini untuk melakukan login seperti biasa, login ini mengambil dari data user di database. User ini memuat data seperti id, username, email, password, namaLengkap, idjabatan, refreshToken, tgl_buat, tgl_edit. Aplikasi ini menggunakan sistem **user privillage** yang dimana jika user tersebut adalah seorang Rekam Medis maka hanya bisa melihat data data tertentu sebagai contoh data pasien, dan data rekam medis pasien. **Untuk password ini sudah di enkripsi di dalam database jadi paswword tidak akan di tampilkan secara langsung melainkan huruf yang acak menggunakan bcryptjs**.

untuk melakukan login memerlukan body yaitu username dan password sebagai berikut:

```json
{
  "username": "moyo",
  "password": "moyomoyo"
}
```

dan untuk response yang di dapat yaitu terdapat access_token dan refresh_token. Access_token berguna untuk akses melihat data, menambahkan data, atau mengedit data sedangkan refresh_token berguna untuk menyegarkan access_token jika sudah kadaluarsa. Berikut respon yang di dapat:

```json
{
  "status": "200",
  "message": "Berhasil masuk",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtYUxlbmdrYXAiOiJXaXNtb3lvIEJhZ2FzIExha3Nvbm8iLCJqYWJhdGFuIjoiQWRtaW4iLCJpYXQiOjE3MzkzNDY3NzEsImV4cCI6MTczOTM0OTc3MX0.q2Kq77a_BzeaSp49lZnhOCVDkFsi-FU7Lh72AoaZra4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtYUxlbmdrYXAiOiJXaXNtb3lvIEJhZ2FzIExha3Nvbm8iLCJqYWJhdGFuIjoiQWRtaW4iLCJpYXQiOjE3MzkzNDY3NzEsImV4cCI6MTczOTQzMzE3MX0.YP4J1b5j1gwnbUycaMF5YOuSMcZhOuTQNItfUprkFnA"
  },
  "timestamp": "2025-02-12T07:52:51.916Z",
  "error": null,
  "meta": null
}
```

untuk accessToken dan refreshToken ini akan di simpan secara otomatis di HTTPCookiesOnly. setiap request ke data haru memerlukan access_token yang valid

#### /api/pasien

route ini untuk menyimpan data **POST** dan mengambil data **GET**. Untuk melakukan penyimpanan data pasien terdapat body yang harus di kirimkan yaitu:

```json
{
  "idIdentitas": "21381237",
  "wna": "WNI",
  "namaLengkap": "kiki niki",
  "jenisKelamin": "Laki-laki",
  "tglLahir": "2000-01-15T00:00:00.000Z",
  "tmptLahir": "Jakarta",
  "agama": "Islam",
  "alamat": "Jl. Merdeka No. 10",
  "provinsi": "DKI Jakarta",
  "rt": "01",
  "rw": "02",
  "kecamatan": "Menteng",
  "kelurahan": "Gambir",
  "pekerjaan": "Pegawai Negeri",
  "pernikahan": "Menikah",
  "pendidikan": "S1",
  "golDarah": "O",
  "noAsuransi": "ASUR001",
  "ibuKandung": "Siti Aminah",
  "noTlp": "081234567890"
}
```

melakukan pengambilan data berdasar parameter url, terdapat beberapa parameter diantaranya:

- Page : Halaman mana yang ingin di tampilkan
- limit : Batas data yang ingin di tampilkan perhalaman
- startDate : Tanggal awal data yang ingin di tampilkan defaultnya di tanggal dan bulan pertama dan mengikuti tahun
- endDate : Tanggal Akhir data yang ingin di tampilkan defaultnya di tanggal dan bulan terakhir dan mengikuti tahun

contoh dari response API untuk mengambil data pasien:

```json
{
  "status": "200",
  "message": "Berhasil mengambil semua data pasien",
  "data": [
    {
      "id": 1,
      "noRm": "202400001",
      "idIdentitas": "ID001",
      "wna": "WNI",
      "namaLengkap": "Budi Santoso",
      "jenisKelamin": "Laki-laki",
      "tglLahir": "1990-01-15T00:00:00.000Z",
      "tmptLahir": "Jakarta",
      "agama": "Islam",
      "alamat": "Jl. Merdeka No. 10",
      "provinsi": "DKI Jakarta",
      "rt": "01",
      "rw": "02",
      "kecamatan": "Menteng",
      "kelurahan": "Gambir",
      "pekerjaan": "Pegawai Negeri",
      "pernikahan": "Menikah",
      "pendidikan": "S1",
      "golDarah": "O",
      "noAsuransi": "ASUR001",
      "ibuKandung": "Siti Aminah",
      "noTlp": "081234567890",
      "tglDaftar": "2024-10-01T12:29:55.646Z",
      "tglEdit": "2024-10-01T12:29:55.646Z"
    }
  ],
  "timestamp": "2025-02-12T06:43:44.804Z",
  "error": null,
  "meta": {
    "totalPatient": 13,
    "totalPages": 13,
    "currentPage": 1,
    "limit": 1,
    "startDate": "2023-12-31T17:00:00.000Z",
    "endDate": "2024-12-30T16:59:59.999Z"
  }
}
```

#### /api/rawat-jalan

Route ini berguna untuk **POST** menyimpan pasien untuk rawat-jalan dan **GET** untuk mengambil data rawat-jalan. Untuk melakukan penyimpanan rawat-jalan terdapat body sebagai berikut:

```json
{
  "idPasien": 1,
  "keluhan": "sakit perut",
  "kode": "z67.3"
}
```

idPasien otomatis berelasi dengan database pasien di ata menunjukan id pasien 1 berarti id pasien 1 yang di daftarkan rawat jalan dengan keluhan sakit perut, dan terdapat kode diagnosa yaitu kode (kode diagnosa hanya sebagai contoh)

untuk melakukan pengambilan data **GET** terdapat juga parameter yang sama dengan route pasien, berikut adalah contoh output dari pengambilan data rawat jalan:

```json
{
  "status": "200",
  "message": "Berhasil mengambil data rawat jalan",
  "data": [
    {
      "id": 1,
      "idPasien": 5,
      "tanggalMasuk": "2024-10-01T12:32:11.341Z",
      "keluhan": "sakit perut",
      "kode": "z67.3",
      "pasien": {
        "noRm": "202400005",
        "namaLengkap": "Fajar Pramudito"
      }
    }
  ],
  "timestamp": "2025-02-12T07:36:51.764Z",
  "error": null,
  "meta": {
    "totalOutPatient": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 11,
    "startDate": "2024-09-30T17:00:00.000Z",
    "endDate": "2024-10-01T16:59:59.999Z"
  }
}
```

## Aplikasi ini juga memiliki fitur diantaranya

- Menggunakan jsonwebtoken sehingga aplikasi ini memerlukan token yang di kirim ke HTTPCookiesOnly untuk melakukan akses ke semua data
- Menggunakan ORM Prisma dan PosgreSQL sebagai database
- mekakukan CRUD data

aplikasi ini sangat sederhana dan dibuat untuk mengenal cara penggunaan express.js, Prisma, penggunaan jsonwebtoken, dan pemodelan relasi database.
