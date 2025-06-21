// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Rute untuk menampilkan halaman login
router.get('/login', userController.getLoginPage);

// Rute untuk memproses login
router.post('/login', userController.loginUser);

// Rute untuk logout
router.get('/logout', userController.logoutUser);

// GET semua pengguna (jika masih diperlukan)
router.get('/', userController.getAllUsers);

module.exports = router;
