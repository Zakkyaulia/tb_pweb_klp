const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Rute untuk menampilkan halaman login
router.get('/login', authController.getLoginPage);

// Rute untuk memproses login
router.post('/login', authController.loginUser);

// Rute untuk logout
router.get('/logout', authController.logoutUser);

module.exports = router; 