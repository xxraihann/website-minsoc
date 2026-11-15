
"use strict";

// ==========================================
// 1. KONFIGURASI API OPEN-METEO
// ==========================================

const API_CUACA =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=-6.9175" +
    "&longitude=107.6191" +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m" +
    "&timezone=Asia%2FJakarta";


// ==========================================
// 2. MENGAMBIL ELEMEN HTML
// ==========================================

const loadingCuaca = document.getElementById("weather-loading");
const successCuaca = document.getElementById("weather-success");
const errorCuaca = document.getElementById("weather-error");
const daftarCuaca = document.getElementById("weather-list");
const pesanError = document.getElementById("weather-error-message");
const tombolRefresh = document.getElementById("btn-refresh-weather");


// ==========================================
// 3. MENERJEMAHKAN KODE CUACA
// ==========================================

function deskripsiCuaca(kode) {

    const kondisi = {
        0: "Cerah",
        1: "Cerah berawan",
        2: "Berawan sebagian",
        3: "Mendung",
        45: "Berkabut",
        48: "Kabut tebal",
        51: "Gerimis ringan",
        53: "Gerimis sedang",
        55: "Gerimis lebat",
        61: "Hujan ringan",
        63: "Hujan sedang",
        65: "Hujan lebat",
        80: "Hujan lokal ringan",
        81: "Hujan lokal sedang",
        82: "Hujan lokal lebat",
        95: "Badai petir"
    };

    return kondisi[kode] || "Kondisi cuaca lainnya";
}


// ==========================================
// 4. MENAMPILKAN LOADING
// ==========================================

function tampilkanLoading() {

    loadingCuaca.style.display = "block";
    successCuaca.style.display = "none";
    errorCuaca.style.display = "none";

    tombolRefresh.style.display = "none";
}


// ==========================================
// 5. MENAMPILKAN ERROR
// ==========================================

function tampilkanError(pesan) {

    loadingCuaca.style.display = "none";
    successCuaca.style.display = "none";
    errorCuaca.style.display = "block";

    pesanError.textContent = pesan;

    tombolRefresh.style.display = "inline-block";
}


// ==========================================
// 6. MENAMPILKAN DATA CUACA
// ==========================================

function tampilkanCuaca(data) {

    const current = data.current;
    const units = data.current_units;

    const daftarData = [
        {
            id: "temperature",
            nama: "Suhu Udara",
            nilai: current.temperature_2m,
            satuan: units.temperature_2m,
            icon: "🌡️"
        },
        {
            id: "humidity",
            nama: "Kelembapan",
            nilai: current.relative_humidity_2m,
            satuan: units.relative_humidity_2m,
            icon: "💧"
        },
        {
            id: "apparent-temperature",
            nama: "Terasa Seperti",
            nilai: current.apparent_temperature,
            satuan: units.apparent_temperature,
            icon: "🌤️"
        },
        {
            id: "precipitation",
            nama: "Curah Hujan",
            nilai: current.precipitation,
            satuan: units.precipitation,
            icon: "🌧️"
        },
        {
            id: "wind",
            nama: "Kecepatan Angin",
            nilai: current.wind_speed_10m,
            satuan: units.wind_speed_10m,
            icon: "💨"
        }
    ];

    // Render data menggunakan map()
    daftarCuaca.innerHTML = daftarData.map(function(item) {

        return `
            <div class="col-12 col-md-4" data-key="${item.id}">
                <div class="card h-100 border-success">
                    <div class="card-body">
                        <p class="text-secondary mb-2">
                            ${item.icon} ${item.nama}
                        </p>

                        <h3 class="h4 fw-bold text-success mb-0">
                            ${item.nilai} ${item.satuan}
                        </h3>
                    </div>
                </div>
            </div>
        `;

    }).join("");

    // Informasi kondisi cuaca
    document.getElementById("weather-description").textContent =
        deskripsiCuaca(current.weather_code);

    document.getElementById("weather-time").textContent =
        "Waktu pengamatan: " + current.time.replace("T", " ");

    loadingCuaca.style.display = "none";
    errorCuaca.style.display = "none";
    successCuaca.style.display = "block";

    tombolRefresh.style.display = "inline-block";
}


// ==========================================
// 7. FUNGSI UTAMA AJAX MENGGUNAKAN FETCH()
// ==========================================

async function ambilDataCuaca() {

    tampilkanLoading();

    try {

        const response = await fetch(API_CUACA);

        // Memeriksa status HTTP
        if (!response.ok) {
            throw new Error(
                "Server memberikan respons HTTP " + response.status
            );
        }

        // Mengubah respons menjadi JSON
        const data = await response.json();

        // Memastikan data cuaca tersedia
        if (!data.current || !data.current_units) {
            throw new Error("Format data cuaca tidak sesuai.");
        }

        // Menampilkan data berhasil
        tampilkanCuaca(data);

    } catch (error) {

        console.error("Kesalahan API Cuaca:", error);

        tampilkanError(
            error.message || "Terjadi kesalahan saat mengambil data."
        );

    }
}


// ==========================================
// 8. INTERAKSI TOMBOL COBA LAGI
// ==========================================

tombolRefresh.addEventListener("click", function() {

    ambilDataCuaca();

});


// ==========================================
// 9. MEMANGGIL API SAAT HALAMAN DIBUKA
// ==========================================

ambilDataCuaca();
