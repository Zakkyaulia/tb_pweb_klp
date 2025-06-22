const { Pengumuman } = require('../models');

exports.getAllPengumuman = async (req, res) => {
    try {
        const pengumuman = await Pengumuman.findAll({
            order: [['tanggal_posting', 'DESC']]
        });
        res.render('pengumuman', { pengumuman, error: null });
    } catch (error) {
        console.error('Error fetching pengumuman:', error);
        res.status(500).render('pengumuman', {
            pengumuman: [],
            error: 'Gagal memuat data pengumuman'
        });
    }
}; 