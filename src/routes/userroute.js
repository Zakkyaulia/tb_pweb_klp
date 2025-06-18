// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// DELETE berdasarkan NIM
router.delete('/:nim', userController.deleteUserByNim);
router.get('/:nim', userController.getUserByNim);
router.get('/', userController.getAllUsers);
module.exports = router;
