const { request_surat } = require('../models');

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

