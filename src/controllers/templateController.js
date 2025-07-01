const path = require('path');
const fs = require('fs');
const { surat } = require('../models');

exports.getTemplates = async (req, res) => {
  try {
    const daftarTemplate = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat']
    });
    
    // Mapping jenis surat ke nama lengkap untuk tampilan
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

exports.viewTemplateFile = async (req, res) => {
  try {
    const suratId = req.params.id;
    const suratData = await surat.findByPk(suratId, { attributes: ['jenis_surat'] });

    if (!suratData) {
      return res.status(404).send('Data surat tidak ditemukan.');
    }

    const fileName = templateFileMapping[suratData.jenis_surat];
    
    if (!fileName) {
      return res.status(404).send('File template untuk jenis surat ini tidak terdaftar.');
    }
    
    const templatePath = path.join(__dirname, '..', 'public', 'templates', fileName);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).send('File template tidak ditemukan di server: ' + templatePath);
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.sendFile(templatePath);
    
  } catch (error) {
    console.error('Error viewing template:', error);
    res.status(500).send('Terjadi kesalahan saat menampilkan template');
  }
};

exports.getTemplateDetail = async (req, res) => {
  try {
    const suratId = req.params.id;
    const suratData = await surat.findByPk(suratId);

    if (!suratData) {
      return res.render('template_detail', { template: null });
    }

    // Mapping jenis surat ke nama lengkap
    const namaLengkapMapping = {
      'SKAK': 'Surat Keterangan Aktif Kuliah',
      'SKL': 'Surat Keterangan Lulus',
      'SBSS': 'Surat Berhenti Studi Sementara',
      'SAK': 'Surat Aktif Kembali',
      'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
    };

    const template = {
      surat_id: suratData.surat_id,
      jenis_surat: suratData.jenis_surat,
      nama_lengkap: namaLengkapMapping[suratData.jenis_surat] || suratData.jenis_surat,
      template_file: templateFileMapping[suratData.jenis_surat] || 'File tidak tersedia'
    };

    res.render('template_detail', { template: template });
  } catch (error) {
    console.error('Error getting template detail:', error);
    res.status(500).render('template_detail', { template: null });
  }
};

exports.downloadTemplate = async (req, res) => {
  try {
    const suratId = req.params.id;
    const suratData = await surat.findByPk(suratId, { attributes: ['jenis_surat'] });

    if (!suratData) {
      return res.status(404).send('Data surat tidak ditemukan.');
    }

    const fileName = templateFileMapping[suratData.jenis_surat];
    
    if (!fileName) {
      return res.status(404).send('File template untuk jenis surat ini tidak terdaftar.');
    }
    
    const templatePath = path.join(__dirname, '..', 'public', 'templates', fileName);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).send('File template tidak ditemukan di server: ' + templatePath);
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(templatePath);
    
  } catch (error) {
    console.error('Error downloading template:', error);
    res.status(500).send('Terjadi kesalahan saat mengunduh template');
  }
};