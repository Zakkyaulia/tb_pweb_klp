const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { request_surat } = require('../models');
const adminController = require('../controllers/admincontroller');
const userController = require('../controllers/usercontroller');
const { isAuthenticated } = require('../middleware/auth');

// Terapkan middleware ini ke semua rute di bawah ini
router.use(isAuthenticated);

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

// ------------------ REQUEST SURAT ------------------
router.get('/requests/diajukan', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const requests = await request_surat.findAll({
            where: { status: 'diajukan' },
            limit: limit,
            offset: offset
        });

        const totalRequests = await request_surat.count({ where: { status: 'diajukan' } });
        const totalPages = Math.ceil(totalRequests / limit);

        console.log('Fetched requests:', requests.length);
        console.log('Total requests:', totalRequests);
        console.log('Total pages:', totalPages);
        console.log('Current page:', page);

        res.render('admin/ajuandiajukan', {
            requests: requests || [],
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuandiajukan', { requests: [], error: 'Error fetching requests' });
    }
});

router.get('/requests/diproses', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const requests = await request_surat.findAll({
            where: { status: 'diproses' },
            limit: limit,
            offset: offset
        });

        const totalRequests = await request_surat.count({ where: { status: 'diproses' } });
        const totalPages = Math.ceil(totalRequests / limit);

        res.render('admin/ajuandiproses', {
            requests: requests || [],
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuandiproses', { requests: [], error: 'Error fetching requests' });
    }
});

router.get('/requests/selesai', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const requests = await request_surat.findAll({
            where: { status: 'selesai' },
            limit: limit,
            offset: offset
        });

        const totalRequests = await request_surat.count({ where: { status: 'selesai' } });
        const totalPages = Math.ceil(totalRequests / limit);

        res.render('admin/ajuanselesai', {
            requests: requests || [],
            page: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuanselesai', { requests: [], error: 'Error fetching requests' });
    }
});

router.get('/requests/semua', adminController.getAllRequests);

router.post('/requests/update/:id', adminController.updateRequestStatus);

// Route untuk generate PDF permintaan diproses
router.get('/requests/diproses/pdf', adminController.generatePDFForDiproses);

// Route untuk generate PDF permintaan selesai
router.get('/requests/selesai/pdf', adminController.generatePDFForSelesai);

// Route untuk generate PDF permintaan diajukan
router.get('/requests/diajukan/pdf', adminController.generatePDFForDiajukan);

// Route untuk memperbarui komentar
router.post('/requests/comment/:id', adminController.updateRequestComment);

// ------------------ PENGELOLAAN PENGGUNA ------------------
router.get('/kelola-pengguna', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { users, totalPages, currentPage } = await userController.fetchAllUsers(null, page, null);
        
        res.render('admin/kelolapengguna', { 
            users: users || [],
            totalPages: totalPages,
            currentPage: currentPage
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('admin/kelolapengguna', { 
            users: [], 
            error: 'Error fetching users',
            totalPages: 1,
            currentPage: 1
        });
    }
});

// Route untuk menghapus user
router.delete('/users/:user_id', adminController.deleteUser);

// Rute untuk menampilkan halaman detail pengguna
router.get('/detailuser', async (req, res) => {
    try {
        const { jurusan, nim } = req.query;
        const page = parseInt(req.query.page) || 1;
        const { users, totalPages, currentPage, totalUsers } = await userController.fetchAllUsers(jurusan, page, nim);
        const allJurusan = ["Sistem Informasi", "Teknik Komputer", "Informatika"]; // Daftar jurusan untuk dropdown

        res.render('admin/detailuser', { 
            users: users || [],
            allJurusan: allJurusan,
            selectedJurusan: jurusan || 'Semua',
            totalPages: totalPages,
            currentPage: currentPage,
            totalUsers: totalUsers,
            searchNIM: nim || ''
        });
    } catch (error) {
        console.error('Error fetching users for detail page:', error);
        res.status(500).render('admin/detailuser', { 
            users: [], 
            error: 'Gagal memuat data pengguna.',
            allJurusan: ["Sistem Informasi", "Teknik Komputer", "Informatika"],
            selectedJurusan: 'Semua',
            totalPages: 1,
            currentPage: 1,
            totalUsers: 0,
            searchNIM: ''
        });
    }
});

router.get('/detailuser/pdf', adminController.generatePDFForUserDetail);

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