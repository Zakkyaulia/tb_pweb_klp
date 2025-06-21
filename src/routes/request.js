const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const requestController = require('../controllers/requestController');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung'));
    }
  }
});

router.get('/step1', requestController.getStep1);
router.post('/step1', requestController.postStep1);
router.get('/step2', requestController.getStep2);
router.post('/submit', upload.single('dokumen'), requestController.postSubmit);
router.get('/edit/:id', requestController.getEdit);
router.post('/edit/:id', upload.single('dokumen'), requestController.postEdit);
router.delete('/delete/:id', requestController.deleteRequest);

module.exports = { router };