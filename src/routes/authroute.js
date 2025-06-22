const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/authMiddleware');

// Rute untuk menampilkan halaman login
router.get('/login', requireGuest, authController.getLoginPage);

// Rute untuk memproses login
router.post('/login', requireGuest, authController.loginUser);

// Rute untuk logout
router.get('/logout', authController.logoutUser);

module.exports = router; 