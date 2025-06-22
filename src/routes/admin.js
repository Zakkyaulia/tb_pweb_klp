// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

// Route untuk dashboard admin (sekarang menampilkan detail user)
router.get('/dashboard-admin', adminController.getUsers);

// Route baru untuk detail user
router.get('/detail-user', adminController.getUsers);

// Hapus atau komentari route permintaan yang tidak digunakan lagi
// router.get('/permintaan', adminController.getPermintaanAdmin);

// Route untuk update status permintaan (dapat dipertahankan jika masih relevan)
router.put('/permintaan/:id/status', adminController.updateRequestStatus);

module.exports = router;
