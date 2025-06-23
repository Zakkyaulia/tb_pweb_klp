const express = require('express');
const router = express.Router();

// Rute untuk menampilkan halaman petunjuk
router.get('/', (req, res) => {
  res.render('petunjuk', { active: 'Petunjuk' });
});

module.exports = router; 