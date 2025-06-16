// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authService = require('../auth'); // Import middleware protect dan authorize

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Private routes (memerlukan middleware protect)
router.post('/logout', authService.protect, authController.logout);
router.get('/profile', authService.protect, authController.getProfile);

// Admin-only route (memerlukan middleware protect dan authorize)
router.get('/admin-dashboard', authService.protect, authService.authorize(['admin']), authController.getAdminDashboard);

module.exports = router;