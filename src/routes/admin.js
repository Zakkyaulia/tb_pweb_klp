// routes/admin.js
const express = require('express');
const router = express.Router();

// Route untuk dashboard admin
router.get('/dashboard-admin', (req, res) => {
  res.render('dashboard_admin'); // Ganti sesuai nama file ejs dashboard kamu
});

// Route untuk halaman permintaan
router.get('/permintaan', (req, res) => {
  res.render('permintaan_admin'); // Pastikan file `permintaan_admin.ejs` ada di views
});

module.exports = router;
