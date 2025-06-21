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

