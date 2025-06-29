const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { requireAuth } = require('../middleware/authMiddleware');

// Middleware autentikasi untuk semua route template
router.use(requireAuth);

// Tampilkan daftar template surat
router.get('/', templateController.getTemplates);
// Tampilkan file template PDF (preview)
router.get('/view/:id', templateController.viewTemplateFile);

module.exports = { router };