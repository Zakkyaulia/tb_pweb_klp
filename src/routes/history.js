// routes/historyRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('history'); // pastikan ada views/history.ejs
});

module.exports = router;
