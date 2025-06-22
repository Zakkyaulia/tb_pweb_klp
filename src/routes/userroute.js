// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { ensureUser } = require('../middleware/auth'); // Impor middleware

// Rute untuk menampilkan dashboard user
router.get('/dashboard', ensureUser, userController.getDashboard);

// GET semua pengguna (jika masih diperlukan untuk API misalnya)
router.get('/', userController.getAllUsers);

module.exports = router;
