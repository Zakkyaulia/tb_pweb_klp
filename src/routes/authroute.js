const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { requireGuest } = require('../middleware/authMiddleware');

// Tampilkan halaman login
router.get('/login', requireGuest, authController.getLoginPage);

// Proses login user
router.post('/login', requireGuest, authController.loginUser);

// Logout user
router.get('/logout', authController.logoutUser);

module.exports = router; 