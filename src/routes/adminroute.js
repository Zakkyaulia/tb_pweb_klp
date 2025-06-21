const express = require('express');
const router = express.Router();
const { request_surat } = require('../models');
const adminController = require('../controllers/admincontroller');
const userController = require('../controllers/usercontroller');

router.get('/requests/diajukan', async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'diajukan' } });
        console.log('Requests diajukan:', requests);
        res.render('admin/ajuandiajukan', { requests: requests || [] });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuandiajukan', { requests: [], error: 'Error fetching requests' });
    }
});

router.get('/requests/diproses', async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'diproses' } });
        console.log('Requests diproses:', requests);
        res.render('admin/ajuandiproses', { requests: requests || [] });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuandiproses', { requests: [], error: 'Error fetching requests' });
    }
});

router.get('/requests/selesai', async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'selesai' } });
        console.log('Requests selesai:', requests);
        res.render('admin/ajuanselesai', { requests: requests || [] });
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

router.get('/requests/semua', async (req, res) => {
    try {
        const requests = await request_surat.findAll();
        console.log('Requests semua:', requests);
        res.render('admin/ajuansemua', { requests: requests || [] });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuansemua', { requests: [], error: 'Error fetching requests' });
    }
});

router.post('/requests/update/:id', adminController.updateRequestStatus);

module.exports = router;