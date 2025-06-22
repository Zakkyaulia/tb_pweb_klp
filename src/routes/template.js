// src/routes/template.js
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Halaman utama untuk menampilkan semua template
router.get('/', templateController.getAllTemplates);

// Halaman detail template berdasarkan ID
router.get('/:id', templateController.getTemplateDetail);

module.exports = router;
