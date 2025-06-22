const express = require('express');
const router = express.Router();

// Halaman awal redirect ke login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Pilih role
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login/choose', (req, res) => {
  const { role } = req.body;
  if (role === 'admin') {
    res.redirect('/login/admin');
  } else if (role === 'mahasiswa') {
    res.redirect('/login/mahasiswa');
  } else {
    res.redirect('/login');
  }
});

// Login admin
router.get('/login/admin', (req, res) => {
  res.render('login_admin');
});

router.post('/login/admin', (req, res) => {
  const { username, password } = req.body;
  // TODO: validasi login admin
  res.redirect('/dashboard-admin');
});

// Login mahasiswa
router.get('/login/mahasiswa', (req, res) => {
  res.render('login_mahasiswa');
});

router.post('/login/mahasiswa', (req, res) => {
  const { username, password } = req.body;
  // TODO: validasi login mahasiswa
  res.redirect('/pengumuman');
});

module.exports = router;
