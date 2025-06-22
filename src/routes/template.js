const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Halaman daftar template
router.get('/', templateController.getTemplates);

// Lihat template PDF
router.get('/view/:suratId', templateController.viewTemplateFile);

module.exports = { router };