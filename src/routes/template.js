// src/routes/template.js
const express = require('express');
const router = express.Router(); // ✅ PENTING!

// Halaman utama template (jika ada)
router.get('/', (req, res) => {
  res.render('template'); // ganti sesuai file EJS utama jika ada
});

// Halaman detail template berdasarkan ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const templates = {
    1: { judul: 'Surat Keterangan Aktif Kuliah', file: 'aktif-kuliah.pdf' },
    2: { judul: 'Surat Keterangan Lulus', file: 'lulus.pdf' },
    3: { judul: 'Surat Berhenti Studi Sementara', file: 'berhenti.pdf' },
    4: { judul: 'Surat Aktif Kembali', file: 'aktif-kembali.pdf' },
    5: { judul: 'Surat Keterangan Tidak Menerima Beasiswa', file: 'tidak-beasiswa.pdf' }
  };

  const template = templates[id];
  if (!template) return res.status(404).send('Template tidak ditemukan');

  res.render('template_detail', { judul: template.judul, file: template.file });
});

module.exports = router; // ✅ Agar bisa digunakan di app.js
