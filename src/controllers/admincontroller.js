const { request_surat, User } = require('../models');

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await request_surat.findByPk(id);
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

exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        console.log('Attempting to delete user with ID:', user_id); // Debug log
        const user = await User.findByPk(user_id);
        console.log('Found user:', user); // Debug log
        
        if (user) {
            // Hapus semua request surat yang terkait dengan user ini terlebih dahulu
            await request_surat.destroy({
                where: { user_id: user_id }
            });
            console.log('Related request_surats deleted'); // Debug log
            
            // Kemudian hapus user
            await user.destroy();
            console.log('User deleted successfully'); // Debug log
            res.status(200).json({ success: true, message: 'User berhasil dihapus' });
        } else {
            console.log('User not found'); // Debug log
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user: ' + error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const { jenis_surat, tanggal } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Buat filter query
        const whereClause = {};
        if (jenis_surat && jenis_surat !== 'Semua') {
            whereClause.jenis_surat = jenis_surat;
        }
        if (tanggal) {
            // Menggunakan fungsi DATE dari sequelize untuk membandingkan tanggal saja
            whereClause.tanggal_request = request_surat.sequelize.where(
                request_surat.sequelize.fn('DATE', request_surat.sequelize.col('tanggal_request')),
                '=',
                tanggal
            );
        }

        // Ambil semua jenis surat yang unik untuk dropdown filter
        const allJenisSurat = await request_surat.findAll({
            attributes: [[request_surat.sequelize.fn('DISTINCT', request_surat.sequelize.col('jenis_surat')), 'jenis_surat']],
            raw: true
        }).then(results => results.map(r => r.jenis_surat));

        // Ambil data yang difilter dengan paginasi
        const { count, rows } = await request_surat.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['tanggal_request', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit) || 1;

        res.render('admin/ajuansemua', {
            requests: rows || [],
            page: page,
            totalPages: totalPages,
            allJenisSurat: allJenisSurat,
            currentFilters: { jenis_surat, tanggal },
            query: req.query
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuansemua', { 
            requests: [], 
            error: 'Terjadi kesalahan saat mengambil data permintaan.',
            allJenisSurat: [],
            currentFilters: req.query,
            page: 1,
            totalPages: 1,
            query: req.query
        });
    }
};

