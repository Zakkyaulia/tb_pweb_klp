const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatController');

router.get('/', riwayatController.getRiwayat);
router.get('/detail/:id', riwayatController.getDetail);

module.exports = { router };