
"use strict";

// ==========================================
// 1. DATA DUMMY JADWAL LAPANGAN
// ==========================================

const jadwalLapangan = [
    {
        id: 1,
        lapangan: "Lapangan A",
        tanggal: "2026-10-20",
        jam: "08.00 - 09.00",
        harga: 150000,
        status: "tersedia"
    },
    {
        id: 2,
        lapangan: "Lapangan A",
        tanggal: "2026-10-20",
        jam: "09.00 - 10.00",
        harga: 150000,
        status: "tersedia"
    },
    {
        id: 3,
        lapangan: "Lapangan A",
        tanggal: "2026-10-20",
        jam: "10.00 - 11.00",
        harga: 150000,
        status: "terisi"
    },
    {
        id: 4,
        lapangan: "Lapangan A",
        tanggal: "2026-10-20",
        jam: "11.00 - 12.00",
        harga: 150000,
        status: "tersedia"
    },
    {
        id: 5,
        lapangan: "Lapangan B",
        tanggal: "2026-10-20",
        jam: "08.00 - 09.00",
        harga: 175000,
        status: "terisi"
    },
    {
        id: 6,
        lapangan: "Lapangan B",
        tanggal: "2026-10-20",
        jam: "09.00 - 10.00",
        harga: 175000,
        status: "tersedia"
    }
];

// ==========================================
// 2. FORMAT HARGA
// ==========================================

function formatRupiah(nominal) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nominal);
}

// ==========================================
// 3. MENGHITUNG JUMLAH SLOT
// ==========================================

function hitungJadwal(status) {
    if (status === "semua") {
        return jadwalLapangan.length;
    }

    return jadwalLapangan.filter(function (jadwal) {
        return jadwal.status === status;
    }).length;
}

// ==========================================
// 4. MENAMPILKAN JADWAL KE TABEL HTML
// ==========================================

function tampilkanJadwal() {
    const tabel = document.getElementById("jadwal-body");

    // Berhenti jika halaman tidak memiliki tabel jadwal
    if (!tabel) {
        return;
    }

    const filterStatus =
        document.getElementById("filter-status").value;

    const dataTampil = jadwalLapangan.filter(function (jadwal) {
        if (filterStatus === "semua") {
            return true;
        }

        return jadwal.status === filterStatus;
    });

    tabel.innerHTML = "";

    if (dataTampil.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    Tidak ada jadwal sesuai filter.
                </td>
            </tr>
        `;
    } else {
        dataTampil.forEach(function (jadwal) {
            const statusBadge =
                jadwal.status === "tersedia"
                    ? '<span class="badge text-bg-success">Tersedia</span>'
                    : '<span class="badge text-bg-secondary">Terisi</span>';

            const tombol =
                jadwal.status === "tersedia"
                    ? `<button
                           type="button"
                           class="btn btn-sm btn-success pilih-jadwal"
                           data-id="${jadwal.id}">
                           Pilih
                       </button>`
                    : '<span class="text-secondary">Tidak tersedia</span>';

            const baris = `
                <tr>
                    <td>${jadwal.lapangan}</td>
                    <td>${jadwal.tanggal}</td>
                    <td>${jadwal.jam}</td>
                    <td>
                        ${statusBadge}
                        <br>
                        <small>${formatRupiah(jadwal.harga)}</small>
                    </td>
                    <td>${tombol}</td>
                </tr>
            `;

            tabel.insertAdjacentHTML("beforeend", baris);
        });
    }

    // Memperbarui ringkasan jumlah jadwal
    document.getElementById("jumlah-semua").textContent =
        hitungJadwal("semua");

    document.getElementById("jumlah-tersedia").textContent =
        hitungJadwal("tersedia");

    document.getElementById("jumlah-terisi").textContent =
        hitungJadwal("terisi");
}

// ==========================================
// 5. INTERAKSI MENGGUNAKAN JQUERY
// ==========================================

$(document).ready(function () {

    // Tampilkan jadwal ketika halaman dibuka
    tampilkanJadwal();

    // Filter jadwal berdasarkan status
    $("#filter-status").on("change", function () {
        tampilkanJadwal();
    });

    // Tampilkan atau sembunyikan form booking
    $("#tombol-booking").on("click", function () {
        $("#area-form-booking").slideToggle(300);
    });

    // Pilih slot jadwal yang tersedia
    $("#jadwal-body").on("click", ".pilih-jadwal", function () {
        const idJadwal = Number($(this).attr("data-id"));

        const jadwalDipilih = jadwalLapangan.find(function (jadwal) {
            return jadwal.id === idJadwal;
        });

        if (!jadwalDipilih || jadwalDipilih.status !== "tersedia") {
            return;
        }

        $("#booking-lapangan").val(jadwalDipilih.lapangan);
        $("#booking-tanggal").val(jadwalDipilih.tanggal);
        $("#booking-jam").val(jadwalDipilih.id);

        $("#area-form-booking").slideDown(300);

        $("#booking-lapangan").trigger("focus");
    });

    // Menampilkan dan menyembunyikan informasi bantuan
    $("#tombol-info").on("click", function () {
        $("#info-booking").fadeToggle(300);
    });

    // Validasi dan proses booking dummy
    $("#form-booking").on("submit", function (event) {
        event.preventDefault();

        const nama = $("#nama-pemesan").val().trim();
        const email = $("#email-pemesan").val().trim();
        const idJadwal = Number($("#booking-jam").val());
        const lapangan = $("#booking-lapangan").val();
        const tanggal = $("#booking-tanggal").val();

        if (nama === "" || email === "" || !idJadwal) {
            $("#pesan-booking")
                .removeClass("alert-success")
                .addClass("alert-danger")
                .text("Lengkapi nama, email, dan pilih jadwal terlebih dahulu.")
                .hide()
                .fadeIn(300);

            return;
        }

        const jadwalDipilih = jadwalLapangan.find(function (jadwal) {
            return jadwal.id === idJadwal;
        });

        if (!jadwalDipilih || jadwalDipilih.status !== "tersedia") {
            $("#pesan-booking")
                .removeClass("alert-success")
                .addClass("alert-danger")
                .text("Maaf, jadwal tersebut sudah tidak tersedia.")
                .hide()
                .fadeIn(300);

            return;
        }

        // Mengubah status data dummy
        jadwalDipilih.status = "terisi";

        // Memperbarui tampilan tabel
        tampilkanJadwal();

        // Menampilkan notifikasi
        $("#pesan-booking")
            .removeClass("alert-danger")
            .addClass("alert-success")
            .text(
                "Booking dummy berhasil untuk " +
                nama + " pada " +
                jadwalDipilih.lapangan + ", " +
                jadwalDipilih.tanggal + ", pukul " +
                jadwalDipilih.jam + "."
            )
            .hide()
            .fadeIn(300);

        // Mengosongkan data kontak
        $("#nama-pemesan").val("");
        $("#email-pemesan").val("");
        $("#booking-lapangan").val("");
        $("#booking-jam").val("");
    });

});
