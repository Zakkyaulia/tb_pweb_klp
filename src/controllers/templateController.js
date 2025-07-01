const path = require('path');
// const fs = require('fs'); // dihapus karena tidak digunakan
const { surat } = require('../models');

// Controller untuk menampilkan daftar template surat
exports.getTemplates = async (req, res) => {
  try {
    const daftarTemplate = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat']
    });
    
    // Mapping nama lengkap jenis surat
    const namaLengkapMapping = {
      'SKAK': 'Surat Keterangan Aktif Kuliah',
      'SKL': 'Surat Keterangan Lulus',
      'SBSS': 'Surat Berhenti Studi Sementara',
      'SAK': 'Surat Aktif Kembali',
      'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
    };
    
    // Tambahkan nama lengkap ke setiap template
    const templatesWithNames = daftarTemplate.map(template => ({
      ...template.toJSON(),
      nama_lengkap: namaLengkapMapping[template.jenis_surat] || template.jenis_surat
    }));
    
    console.log('Templates found:', templatesWithNames);
    res.render('template', { daftarTemplate: templatesWithNames, active: 'Template' });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.render('template', { daftarTemplate: [], active: 'Template', error: 'Terjadi kesalahan saat memuat daftar template.' });
  }
};

const templateFileMapping = {
  'SKAK': 'SURAT KETERANGAN AKTIF KULIAH.pdf',
  'SKL': 'SURAT KETERANGAN LULUS.pdf',
  'SBSS': 'SURAT BERHENTI STUDI SEMENTARA.pdf',
  'SAK': 'SURAT AKTIF KEMBALI.pdf',
  'SKTMB': 'SURAT KETERANGAN TIDAK MENERIMA BEASISWA.pdf'
};

// Controller untuk menampilkan file template PDF dari database
exports.viewTemplateFile = async (req, res) => {
  try {
    const suratId = req.params.id;
    const suratData = await surat.findByPk(suratId);

    if (!suratData || !suratData.template_file) {
      return res.status(404).send('File template tidak ditemukan di database.');
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="template.pdf"`);
    res.end(suratData.template_file);
  } catch (error) {
    console.error('Error viewing template:', error);
    res.status(500).send('Terjadi kesalahan saat menampilkan template');
  }
};

// Controller untuk menampilkan detail template surat
exports.detailTemplate = async (req, res) => {
  try {
    const suratId = req.params.id;
    const template = await surat.findByPk(suratId);
    if (!template) {
      return res.status(404).render('template_detail', { template: null, error: 'Template tidak ditemukan' });
    }
    // Mapping nama lengkap jenis surat
    const namaLengkapMapping = {
      'SKAK': 'Surat Keterangan Aktif Kuliah',
      'SKL': 'Surat Keterangan Lulus',
      'SBSS': 'Surat Berhenti Studi Sementara',
      'SAK': 'Surat Aktif Kembali',
      'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
    };
    const templateData = {
      ...template.toJSON(),
      nama_lengkap: namaLengkapMapping[template.jenis_surat] || template.jenis_surat
    };
    res.render('template_detail', { template: templateData, error: null });
  } catch (error) {
    res.status(500).render('template_detail', { template: null, error: 'Terjadi kesalahan saat memuat detail template' });
  }
};

// Controller untuk download file template PDF dari database
exports.downloadTemplateFile = async (req, res) => {
  try {
    const suratId = req.params.id;
    const suratData = await surat.findByPk(suratId);

    if (!suratData || !suratData.template_file) {
      return res.status(404).send('File template tidak ditemukan di database.');
    }
    // Ambil nama file dari mapping
    const templateFileMapping = {
      'SKAK': 'SURAT KETERANGAN AKTIF KULIAH.pdf',
      'SKL': 'SURAT KETERANGAN LULUS.pdf',
      'SBSS': 'SURAT BERHENTI STUDI SEMENTARA.pdf',
      'SAK': 'SURAT AKTIF KEMBALI.pdf',
      'SKTMB': 'SURAT KETERANGAN TIDAK MENERIMA BEASISWA.pdf'
    };
    const fileName = templateFileMapping[suratData.jenis_surat] || 'template.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.end(suratData.template_file);
  } catch (error) {
    console.error('Error downloading template:', error);
    res.status(500).send('Terjadi kesalahan saat mengunduh template');
  }
};