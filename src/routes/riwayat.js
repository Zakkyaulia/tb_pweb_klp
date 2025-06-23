const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatController');
const { requireAuth } = require('../middleware/authMiddleware');

// Terapkan middleware requireAuth ke semua rute di bawah ini
router.use(requireAuth);

router.get('/', riwayatController.getRiwayat);

module.exports = { router };