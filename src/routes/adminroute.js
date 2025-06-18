const express = require('express');
const router = express.Router();
const { request_surat } = require('../models');

router.get('/requests/diajukan', async (req, res) => {
  try {
    const requests = await request_surat.findAll({ where: { status: 'diajukan' } });
    console.log('Requests diajukan:', requests); // Tambahkan logging
    res.render('admin/ajuandiajukan', { requests: requests || [] });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).render('admin/ajuandiajukan', { requests: [], error: 'Error fetching requests' });
  }
});

router.get('/requests/diproses', async (req, res) => {
  try {
    const requests = await request_surat.findAll({ where: { status: 'diproses' } });
    console.log('Requests diproses:', requests); // Tambahkan logging
    res.render('admin/ajuandiproses', { requests: requests || [] });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).render('admin/ajuandiproses', { requests: [], error: 'Error fetching requests' });
  }
});

router.get('/requests/selesai', async (req, res) => {
  try {
    const requests = await request_surat.findAll({ where: { status: 'selesai' } });
    console.log('Requests selesai:', requests); // Tambahkan logging
    res.render('admin/ajuanselesai', { requests: requests || [] });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).render('admin/ajuanselesai', { requests: [], error: 'Error fetching requests' });
  }
});

module.exports = router;