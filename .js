const express = require("express");
const serverless = require("serverless-http");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

// Membaca data dari form HTML
app.use(express.urlencoded({ extended: true }));

// Membaca data JSON jika nanti diperlukan
app.use(express.json());

/* =========================
   HELPER KEAMANAN
========================= */

// Mencegah karakter HTML berbahaya ditampilkan langsung ke halaman
function escapeHtml(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validasi email sederhana
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================
   ROUTE CEK BACKEND
========================= */

app.get("/cek", function (req, res) {
  res.status(200).json({
    status: "aktif",
    message: "Backend Netlify Function berhasil berjalan",
  });
});

/* =========================
   ROUTE TERIMA FORM
========================= */

app.post("/halaman-proses-data", function (req, res) {
  const nama = req.body.sender_name?.trim();
  const email = req.body.user_email?.trim();
  const subjek = req.body.message_subject?.trim();
  const isiPesan = req.body.message_body?.trim();

  // Validasi data kosong
  if (!nama || !email || !subjek || !isiPesan) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Data Tidak Lengkap</title>

        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #eef4ff;
            color: #172033;
          }

          .card {
            width: min(92%, 600px);
            padding: 28px;
            border-radius: 22px;
            background: #ffffff;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
          }

          h1 {
            margin-top: 0;
            color: #dc2626;
          }

          p {
            line-height: 1.6;
          }

          a {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 18px;
            border-radius: 999px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>Data belum lengkap</h1>
          <p>Mohon isi nama, email, subjek, dan isi pesan terlebih dahulu.</p>
          <a href="/#pesan">Kembali ke form</a>
        </div>
      </body>
      </html>
    `);
  }

  // Validasi format email
  if (!isValidEmail(email)) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Tidak Valid</title>

        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #eef4ff;
            color: #172033;
          }

          .card {
            width: min(92%, 600px);
            padding: 28px;
            border-radius: 22px;
            background: #ffffff;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
          }

          h1 {
            margin-top: 0;
            color: #dc2626;
          }

          a {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 18px;
            border-radius: 999px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>Email tidak valid</h1>
          <p>Mohon masukkan alamat email yang benar.</p>
          <a href="/#pesan">Kembali ke form</a>
        </div>
      </body>
      </html>
    `);
  }

  // Amankan data sebelum ditampilkan ke HTML
  const namaAman = escapeHtml(nama);
  const emailAman = escapeHtml(email);
  const subjekAman = escapeHtml(subjek);
  const isiPesanAman = escapeHtml(isiPesan);

  // Data ini hanya muncul di log Netlify, belum tersimpan ke database
  console.log("Data pesan masuk:");
  console.log("Nama:", nama);
  console.log("Email:", email);
  console.log("Subjek:", subjek);
  console.log("Isi Pesan:", isiPesan);

  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pesan Berhasil</title>

      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Arial, sans-serif;
          background: #eef4ff;
          color: #172033;
        }

        .card {
          width: min(92%, 600px);
          padding: 28px;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
        }

        h1 {
          margin-top: 0;
          color: #2563eb;
        }

        p {
          line-height: 1.6;
        }

        .message-box {
          margin-top: 14px;
          padding: 14px;
          border-radius: 16px;
          background: #eff6ff;
          color: #1e3a8a;
          white-space: pre-wrap;
        }

        a {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 18px;
          border-radius: 999px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>

    <body>
      <div class="card">
        <h1>Pesan Berhasil Dikirim</h1>

        <p><strong>Nama:</strong> ${namaAman}</p>
        <p><strong>Email:</strong> ${emailAman}</p>
        <p><strong>Subjek:</strong> ${subjekAman}</p>

        <p><strong>Isi Pesan:</strong></p>
        <div class="message-box">${isiPesanAman}</div>

        <a href="/#pesan">Kembali ke halaman utama</a>
      </div>
    </body>
    </html>
  `);
});

/* =========================
   ROUTE JIKA ALAMAT SALAH
========================= */

app.use(function (req, res) {
  res.status(404).json({
    status: "error",
    message: "Route tidak ditemukan",
  });
});

/* =========================
   EXPORT NETLIFY FUNCTION
========================= */

module.exports.handler = serverless(app);