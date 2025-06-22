const express = require('express');
const router = express.Router();

router.get('/pengumuman', (req, res) => {
  res.render('pengumuman');
});

router.get('/petunjuk', (req, res) => {
  res.render('petunjuk');
});

router.get('/dashboard', (req, res) => {
  res.render('tampilas');
});

module.exports = router;
