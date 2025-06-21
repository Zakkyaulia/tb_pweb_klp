// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// GET semua pengguna (jika masih diperlukan untuk API misalnya)
router.get('/', userController.getAllUsers);

module.exports = router;
