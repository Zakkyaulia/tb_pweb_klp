const { RequestSurat, User } = require('../models');

// Fungsi untuk menampilkan halaman detail pengguna
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['nama', 'nim', 'jurusan'],
            order: [['nama', 'ASC']]
        });
        
        res.render('admin/detailuser', { users, error: null });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('admin/detailuser', { 
            users: [],
            error: 'Terjadi kesalahan saat mengambil data pengguna'
        });
    }
};

// Fungsi untuk menampilkan halaman permintaan admin
exports.getPermintaanAdmin = async (req, res) => {
    try {
        const permintaan = await RequestSurat.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['nama', 'nim']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.render('permintaan_admin', { permintaan });
    } catch (error) {
        console.error('Error fetching permintaan:', error);
        res.status(500).render('permintaan_admin', { 
            permintaan: [],
            error: 'Terjadi kesalahan saat mengambil data'
        });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await RequestSurat.findByPk(id);
        if (request) {
            await request.update({ status });
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Permintaan tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
};