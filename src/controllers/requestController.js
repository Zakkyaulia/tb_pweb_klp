const path = require('path');
const fs = require('fs');
const { User, request_surat, surat } = require('../models');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const getJenisSuratName = (kode) => {
  const mapping = {
    'SKAK': 'Surat Keterangan Aktif Kuliah',
    'SKL': 'Surat Keterangan Lulus',
    'SBSS': 'Surat Berhenti Studi Sementara',
    'SAK': 'Surat Aktif Kembali',
    'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
  };
  return mapping[kode] || kode;
};

exports.getStep1 = async (req, res) => {
  // Gunakan data dummy langsung tanpa query database
  const userData = {
    nama: 'dimas',
    nim: '2001',
    jurusan: 'sistem informasi'
  };
  res.render('request-step1', { active: 'Mulai', userData: userData });
};

exports.postStep1 = async (req, res) => {
  const { tanggal } = req.body;

  if (!tanggal) {
    return res.send(`
      <script>
        alert("Tanggal pengajuan wajib diisi!");
        window.history.back();
      </script>
    `);
  }

  // Redirect ke step2 dengan data tanggal sebagai query parameter
  res.redirect(`/request/step2?tanggal=${encodeURIComponent(tanggal)}`);
};

exports.getStep2 = async (req, res) => {
  const { tanggal } = req.query;
  
  if (!tanggal) {
    return res.redirect('/request/step1');
  }
  
  try {
    const daftarSurat = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat']
    });
    
    // Mapping singkatan ke nama lengkap
    const suratMapping = {
      'SKAK': 'Surat Keterangan Aktif Kuliah',
      'SKL': 'Surat Keterangan Lulus',
      'SBSS': 'Surat Berhenti Studi Sementara',
      'SAK': 'Surat Aktif Kembali',
      'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
    };
    
    // Tambahkan nama lengkap ke setiap item
    const daftarSuratDenganNama = daftarSurat.map(item => ({
      ...item.toJSON(),
      nama_lengkap: suratMapping[item.jenis_surat] || item.jenis_surat
    }));
    
    res.render('request-step2', { 
      active: 'Mulai', 
      daftarSurat: daftarSuratDenganNama,
      tanggal: tanggal 
    });
  } catch (error) {
    console.error('Error fetching surat types for step2:', error);
    res.send(`
      <script>
        alert("Terjadi kesalahan saat memuat jenis surat.");
        window.location.href="/request/step1";
      </script>
    `);
  }
};

exports.postSubmit = async (req, res) => {
  try {
    const { tanggal, jenisSuratId } = req.body;
    
    // Debug logs
    console.log('=== DEBUG POST SUBMIT ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('Tanggal:', tanggal);
    console.log('JenisSuratId:', jenisSuratId);
    console.log('File exists:', !!req.file);
    console.log('========================');

    if (!tanggal || !jenisSuratId || !req.file) {
      console.log('Validation failed:');
      console.log('- Tanggal missing:', !tanggal);
      console.log('- JenisSuratId missing:', !jenisSuratId);
      console.log('- File missing:', !req.file);
      return res.send(`
        <script>
          alert("Tanggal pengajuan, jenis surat, dan file pengantar wajib diisi!");
          window.history.back();
        </script>
      `);
    }

    const selectedSurat = await surat.findByPk(jenisSuratId);
    if (!selectedSurat) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.send(`
        <script>
          alert("Jenis surat tidak valid!");
          window.history.back();
        </script>
      `);
    }

    // Gunakan data dummy user
    const currentUser = {
        nama: 'dimas',
        nim: '2001',
        jurusan: 'sistem informasi'
    };

    await request_surat.create({
      user_id: null, // Gunakan null untuk menghindari foreign key constraint
      nama: currentUser.nama,
      nim: currentUser.nim,
      jurusan: currentUser.jurusan,
      jenis_surat: selectedSurat.jenis_surat,
      tanggal_request: new Date(tanggal),
      status: 'diajukan',
      file_pengantar: req.file.filename
    });

    // Redirect langsung ke halaman riwayat
    res.redirect('/riwayat');

  } catch (error) {
    console.error('Error submit:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.send(`
      <script>
        alert("Terjadi kesalahan saat menyimpan data! Silakan coba lagi.");
        window.history.back();
      </script>
    `);
  }
};

exports.getEdit = async (req, res) => {
  try {
    const data = await request_surat.findByPk(req.params.id);

    if (!data) {
      return res.send(`
        <script>
          alert("Data tidak ditemukan!");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    if (data.status !== 'diajukan') {
      return res.send(`
        <script>
          alert("Pengajuan dengan status '${data.status}' tidak dapat diedit.");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    const daftarSurat = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat']
    });

    const formattedData = {
      id: data.id,
      nama: data.nama,
      nim: data.nim,
      jurusan: data.jurusan,
      tanggal: data.tanggal_request.toISOString().split('T')[0],
      jenis: data.jenis_surat,
      file_pengantar: data.file_pengantar
    };

    res.render('edit-request', { data: formattedData, daftarSurat: daftarSurat, active: 'Riwayat' });

  } catch (error) {
    console.error('Error getting edit data:', error);
    res.send(`
      <script>
        alert("Terjadi kesalahan saat mengambil data edit!");
        window.location.href = "/riwayat";
      </script>
    `);
  }
};

exports.postEdit = async (req, res) => {
  try {
    const { tanggal, jenisSuratId } = req.body;

    if (!tanggal || !jenisSuratId) {
      return res.send(`
        <script>
          alert("Tanggal pengajuan dan jenis surat wajib diisi!");
          window.history.back();
        </script>
      `);
    }

    const requestData = await request_surat.findByPk(req.params.id);

    if (!requestData) {
      if (req.file && fs.existsSync(req.file.path)) { fs.unlinkSync(req.file.path); }
      return res.send(`
        <script>
          alert("Data tidak ditemukan!");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    if (requestData.status !== 'diajukan') {
      if (req.file && fs.existsSync(req.file.path)) { fs.unlinkSync(req.file.path); }
      return res.send(`
        <script>
          alert("Pengajuan dengan status '${requestData.status}' tidak dapat diperbarui.");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    const selectedSurat = await surat.findByPk(jenisSuratId);
    if (!selectedSurat) {
        if (req.file && fs.existsSync(req.file.path)) { fs.unlinkSync(req.file.path); }
        return res.send(`
            <script>
                alert("Jenis surat tidak valid!");
                window.history.back();
            </script>
        `);
    }

    const updateData = {
      jenis_surat: selectedSurat.jenis_surat,
      tanggal_request: new Date(tanggal)
    };

    if (req.file) {
      const oldFilePath = path.join(uploadsDir, requestData.file_pengantar);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      updateData.file_pengantar = req.file.filename;
    }

    await request_surat.update(updateData, {
      where: { id: req.params.id }
    });

    res.send(`
      <script>
        alert("Pengajuan berhasil diperbarui!");
        window.location.href = "/riwayat";
      </script>
    `);

  } catch (error) {
    console.error('Error updating:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.send(`
      <script>
        alert("Terjadi kesalahan saat memperbarui data! Silakan coba lagi.");
        window.history.back();
      </script>
    `);
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const data = await request_surat.findByPk(req.params.id);

    if (!data) {
      return res.send(`
        <script>
          alert("Data tidak ditemukan!");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    if (data.status !== 'diajukan') {
      return res.send(`
        <script>
          alert("Pengajuan dengan status '${data.status}' tidak dapat dihapus.");
          window.location.href = "/riwayat";
        </script>
      `);
    }

    if (data.file_pengantar) {
      const filePath = path.join(uploadsDir, data.file_pengantar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await request_surat.destroy({
      where: { id: req.params.id }
    });

    res.send(`
      <script>
        alert("Pengajuan berhasil dihapus!");
        window.location.href = "/riwayat";
      </script>
    `);

  } catch (error) {
    console.error('Error deleting:', error);
    res.send(`
      <script>
        alert("Terjadi kesalahan saat menghapus data!");
        window.location.href = "/riwayat";
      </script>
    `);
  }
};

exports.getJenisSuratName = getJenisSuratName; // Untuk digunakan di riwayat controller