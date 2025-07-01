const path = require('path');
// const fs = require('fs'); // dihapus karena tidak digunakan
const { User, request_surat, surat } = require('../models');

// Mapping singkatan jenis surat ke nama lengkap
const jenisSuratMapping = {
  'SKAK': 'Surat Keterangan Aktif Kuliah',
  'SKL': 'Surat Keterangan Lulus',
  'SKP': 'Surat Keterangan Pengantar',
  'SKM': 'Surat Keterangan Magang',
  'SBSS': 'Surat Berhenti Studi Sementara',
  'SAK': 'Surat Aktif Kembali',
  'SKTMB': 'Surat Keterangan Tidak Menerima Beasiswa'
};

const getJenisSuratName = (abbreviation) => {
  return jenisSuratMapping[abbreviation] || abbreviation;
};

// Tampilkan form step 1 pengajuan surat
exports.getStep1 = async (req, res) => {
  const userData = {
    nama: req.session.user.nama,
    nim: req.session.user.nim,
    jurusan: req.session.user.jurusan
  };
  res.render('request-step1', { active: 'Mulai', userData: userData });
};

// Proses step 1 pengajuan surat
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
  res.redirect(`/request/step2?tanggal=${encodeURIComponent(tanggal)}`);
};

// Tampilkan form step 2 pengajuan surat
exports.getStep2 = async (req, res) => {
  const { tanggal } = req.query;
  if (!tanggal) {
    return res.redirect('/request/step1');
  }
  try {
    const daftarSurat = await surat.findAll({
      attributes: ['surat_id', 'jenis_surat']
    });
    const daftarSuratDenganNama = daftarSurat.map(item => ({
      ...item.toJSON(),
      nama_lengkap: getJenisSuratName(item.jenis_surat)
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

// Proses submit pengajuan surat
exports.postSubmit = async (req, res) => {
  try {
    const { tanggal, jenisSuratId } = req.body;
    if (!tanggal || !jenisSuratId || !req.file) {
      return res.send(`
        <script>
          alert("Tanggal pengajuan, jenis surat, dan file pengantar wajib diisi!");
          window.history.back();
        </script>
      `);
    }
    const selectedSurat = await surat.findByPk(jenisSuratId);
    const currentUser = req.session.user;
    await request_surat.create({
      user_id: currentUser.id,
      nama: currentUser.nama,
      nim: currentUser.nim,
      jurusan: currentUser.jurusan,
      jenis_surat: selectedSurat.jenis_surat,
      tanggal_request: new Date(tanggal),
      status: 'diajukan',
      file_pengantar: req.file.buffer
    });
    res.redirect('/riwayat');
  } catch (error) {
    res.send(`
      <script>
        alert("Terjadi kesalahan saat menyimpan data! Silakan coba lagi.");
        window.history.back();
      </script>
    `);
  }
};

// Tampilkan form edit pengajuan surat
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

// Proses edit pengajuan surat
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
      return res.send(`
        <script>
          alert("Data tidak ditemukan!");
          window.location.href = "/riwayat";
        </script>
      `);
    }
    if (requestData.status !== 'diajukan') {
      return res.send(`
        <script>
          alert("Pengajuan dengan status '${requestData.status}' tidak dapat diperbarui.");
          window.location.href = "/riwayat";
        </script>
      `);
    }
    const selectedSurat = await surat.findByPk(jenisSuratId);
    if (!selectedSurat) {
      return res.send(`
        <script>
          alert("Jenis surat tidak valid!");
          window.history.back();
        </script>
      `);
    }
    
    // Cek apakah ada perubahan yang sebenarnya
    const tanggalChanged = new Date(tanggal).getTime() !== requestData.tanggal_request.getTime();
    const jenisSuratChanged = selectedSurat.jenis_surat !== requestData.jenis_surat;
    const fileChanged = req.file && req.file.buffer;
    
    if (!tanggalChanged && !jenisSuratChanged && !fileChanged) {
      return res.send(`
        <script>
          alert("Tidak ada perubahan yang dilakukan. Data tetap sama seperti sebelumnya.");
          window.location.href = "/riwayat";
        </script>
      `);
    }
    
    const updateData = {
      jenis_surat: selectedSurat.jenis_surat,
      tanggal_request: new Date(tanggal)
    };
    if (req.file) {
      updateData.file_pengantar = req.file.buffer;
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
    res.send(`
      <script>
        alert("Terjadi kesalahan saat memperbarui data! Silakan coba lagi.");
        window.history.back();
      </script>
    `);
  }
};

// Proses hapus pengajuan surat
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
    res.send(`
      <script>
        alert("Terjadi kesalahan saat menghapus data!");
        window.location.href = "/riwayat";
      </script>
    `);
  }
};

// Controller untuk menampilkan detail pengajuan surat
exports.getDetail = async (req, res) => {
  try {
    const data = await request_surat.findByPk(req.params.id);
    if (!data) {
      return res.send(`<script>alert('Data tidak ditemukan!');window.location.href='/riwayat';</script>`);
    }
    const dataObj = data.toJSON ? data.toJSON() : data;
    console.log('DATA DETAIL:', dataObj); // Log debug untuk melihat isi data
    dataObj.nama_lengkap_surat = getJenisSuratName(dataObj.jenis_surat);
    res.render('detail-pengajuan', { data: dataObj });
  } catch (error) {
    res.send(`<script>alert('Terjadi kesalahan saat mengambil detail!');window.location.href='/riwayat';</script>`);
  }
};

exports.getJenisSuratName = getJenisSuratName; // Untuk digunakan di riwayat controller