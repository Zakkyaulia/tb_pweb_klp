const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requestController = require('../controllers/requestController');
const { requireAuth } = require('../middleware/authMiddleware');

// Gunakan memoryStorage untuk upload file langsung ke database
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware autentikasi untuk semua route request
router.use(requireAuth);

// Langkah 1 pengajuan surat
router.get('/step1', requestController.getStep1);
router.post('/step1', requestController.postStep1);
// Langkah 2 pengajuan surat
router.get('/step2', requestController.getStep2);
// Submit pengajuan surat
router.post('/submit', upload.single('dokumen'), requestController.postSubmit);
// Edit pengajuan surat
router.get('/edit/:id', requestController.getEdit);
router.post('/edit/:id', upload.single('dokumen'), requestController.postEdit);
// Hapus pengajuan surat
router.delete('/delete/:id', requestController.deleteRequest);

module.exports = { router };