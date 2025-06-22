const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminController = require('../controllers/admincontroller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diperbolehkan!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// ------------------ DASHBOARD ------------------
router.get('/dashboard', adminController.getDashboardStats);

// ------------------ PENGUMUMAN ------------------
router.get('/pengumuman', adminController.getAllPengumuman);
router.get('/pengumuman/add', adminController.showFormPengumuman);
router.post('/pengumuman/add', adminController.createPengumuman);
router.get('/pengumuman/edit/:id', adminController.showEditFormPengumuman);
router.post('/pengumuman/edit/:id', adminController.updatePengumuman);
router.post('/pengumuman/delete/:id', adminController.deletePengumuman);

// ------------------ TEMPLATE (SURAT) ------------------
router.get('/template', adminController.getAllSurat);
router.get('/template/add', adminController.showFormSurat);
router.post('/template/add', upload.single('templateFile'), adminController.createSurat);
router.post('/template/delete/:id', adminController.deleteSurat);
router.get('/template/edit/:id', adminController.showEditFormSurat);
router.post('/template/edit/:id', upload.single('templateFile'), adminController.updateSurat);

module.exports = router;