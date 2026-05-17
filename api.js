app.get("/cek", function (req, res) {
  res.json({
    status: "aktif",
    message: "Backend Netlify Function berhasil berjalan",
    query: req.query || null,
  });
});

app.post("/halaman-proses-data", function (req, res) {
  // proses data form di sini
  const data = req.body || null;
  // lakukan pemrosesan data jika diperlukan, lalu kirim respons
  res.json({
    status: "success",
    message: "Data diterima dan diproses",
    data: data,
  });
});