-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "namaPemesan" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "namaLapangan" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "durasi" INTEGER NOT NULL,
    "jumlahPemain" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu Konfirmasi',

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_namaLapangan_tanggal_jam_key" ON "bookings"("namaLapangan", "tanggal", "jam");
