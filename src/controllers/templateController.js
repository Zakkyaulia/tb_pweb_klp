const { Surat } = require('../models');

// Menampilkan daftar semua template surat
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Surat.findAll({
            order: [['surat_id', 'ASC']]
        });
        res.render('template', { templates, error: null });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).render('template', {
            templates: [],
            error: 'Gagal memuat data template'
        });
    }
};

// Menampilkan detail satu template surat
exports.getTemplateDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Surat.findByPk(id);

        if (!template) {
            return res.status(404).render('404', { message: 'Template tidak ditemukan' });
        }

        res.render('template_detail', { template, error: null });
    } catch (error) {
        console.error('Error fetching template detail:', error);
        res.status(500).render('template_detail', {
            template: null,
            error: 'Gagal memuat detail template'
        });
    }
}; 