const express = require('express');
const router = express.Router();

// Redirect root ke halaman pengajuan surat
router.get('/', (req, res) => {
  res.redirect('/request/step1');
});

module.exports = { router };