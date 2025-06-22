const express = require('express');
const router = express.Router();
const pengumumanController = require('../controllers/pengumumanController');

// Rute untuk menampilkan halaman pengumuman
router.get('/', pengumumanController.getAllPengumuman);

module.exports = router; 