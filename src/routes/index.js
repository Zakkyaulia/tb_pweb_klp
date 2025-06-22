const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/request/step1');
});

module.exports = { router };