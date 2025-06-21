const path = require('path');
const fs = require('fs');
const { surat } = require('../models');

exports.getTemplates = async (req, res) => {
  try {
    const daftarTemplate = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat', 'template_file']
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

exports.viewTemplateFile = async (req, res) => {
  try {
    const suratId = req.params.suratId;
    console.log('Viewing template for surat_id:', suratId);
    
    // Ambil data surat dari database
    const suratData = await surat.findByPk(suratId);
    console.log('Surat data:', suratData);
    
    if (!suratData || !suratData.template_file) {
      console.log('Template not found in database');
      return res.status(404).send('Template tidak ditemukan');
    }
    
    // Path ke file template
    const templatePath = path.join(__dirname, '..', 'public', 'templates', suratData.template_file);
    console.log('Template path:', templatePath);
    
    // Cek apakah file ada
    if (!fs.existsSync(templatePath)) {
      console.log('Template file not found at path:', templatePath);
      return res.status(404).send('File template tidak ditemukan');
    }
    
    // Kirim file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${suratData.template_file}"`);
    res.sendFile(templatePath);
    
  } catch (error) {
    console.error('Error viewing template:', error);
    res.status(500).send('Terjadi kesalahan saat menampilkan template');
  }
};

// Function untuk update template file (untuk admin)
exports.updateTemplateFile = async (req, res) => {
  try {
    const suratId = req.params.suratId;
    
    if (!req.file) {
      return res.send(`
        <script>
          showAlertAndRedirect("File template wajib diupload!", "error", "/template");
        </script>
      `);
    }

    const suratData = await surat.findByPk(suratId);
    if (!suratData) {
      return res.send(`
        <script>
          showAlertAndRedirect("Jenis surat tidak ditemukan!", "error", "/template");
        </script>
      `);
    }

    // Hapus file lama jika ada
    if (suratData.template_file) {
      const oldFilePath = path.join(__dirname, '../../templates', suratData.template_file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update database dengan nama file baru
    await surat.update(
      { template_file: req.file.filename },
      { where: { surat_id: suratId } }
    );

    res.send(`
      <script>
        showAlertAndRedirect("Template berhasil diupdate!", "success", "/template");
      </script>
    `);

  } catch (error) {
    console.error('Error updating template:', error);
    res.send(`
      <script>
        showAlertAndRedirect("Terjadi kesalahan saat mengupdate template!", "error", "/template");
      </script>
    `);
  }
};