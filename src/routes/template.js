const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { requireAuth } = require('../middleware/authMiddleware');

// Terapkan middleware requireAuth ke semua rute di bawah ini
router.use(requireAuth);

// Halaman daftar template
router.get('/', templateController.getTemplates);

// Lihat template PDF
router.get('/view/:suratId', templateController.viewTemplateFile);

module.exports = { router };