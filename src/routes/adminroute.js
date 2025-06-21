const express = require('express');
const router = express.Router();
const { request_surat } = require('../models');
const adminController = require('../controllers/admincontroller');
const userController = require('../controllers/usercontroller');

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

router.get('/kelola-pengguna', async (req, res) => {
    try {
        const users = await userController.fetchAllUsers();
        console.log('Data users:', users); // Tambahkan log untuk debugging
        res.render('admin/kelolapengguna', { users: users || [] });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('admin/kelolapengguna', { users: [], error: 'Error fetching users' });
    }
});

router.get('/requests/semua', adminController.getAllRequests);

router.post('/requests/update/:id', adminController.updateRequestStatus);

// Route untuk menghapus user
router.delete('/users/:user_id', adminController.deleteUser);

// Route untuk generate PDF permintaan diproses
router.get('/requests/diproses/pdf', adminController.generatePDFForDiproses);

// Route untuk generate PDF permintaan selesai
router.get('/requests/selesai/pdf', adminController.generatePDFForSelesai);

// Route untuk generate PDF permintaan diajukan
router.get('/requests/diajukan/pdf', adminController.generatePDFForDiajukan);

module.exports = router;