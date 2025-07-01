const { request_surat, surat } = require('../models');

// Mapping untuk jenis surat
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

exports.getRiwayat = async (req, res) => {
  try {
    const filter = req.query.filter || 'Semua'; // Default ke 'Semua'

    const whereCondition = {};

    if (filter && filter !== 'Semua') {
      whereCondition.jenis_surat = filter;
    }

    const data = await request_surat.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']]
    });

    const formattedData = data.map(item => ({
      id: item.id,
      nama: item.nama,
      nim: item.nim,
      jurusan: item.jurusan,
      jenis_surat: item.jenis_surat,
      nama_lengkap_surat: getJenisSuratName(item.jenis_surat),
      tanggal_request: item.tanggal_request,
      status: item.status,
      file_pengantar: item.file_pengantar,
      komentar_admin: item.komentar_admin,
      createdAt: item.createdAt
    }));

    res.render('riwayat', {
      data: formattedData,
      filter: filter
    });
  } catch (error) {
    console.error('Error getRiwayat:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data riwayat');
  }
};

exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Detail request for ID:', id);

    const pengajuan = await request_surat.findByPk(id);
    console.log('Found pengajuan:', pengajuan ? 'Yes' : 'No');

    if (!pengajuan) {
      console.log('Pengajuan not found for ID:', id);
      return res.status(404).send('Pengajuan surat tidak ditemukan');
    }

    // Format data untuk ditampilkan
    const detailData = {
      id: pengajuan.id,
      nama: pengajuan.nama,
      nim: pengajuan.nim,
      jurusan: pengajuan.jurusan,
      jenis_surat: pengajuan.jenis_surat,
      nama_lengkap_surat: getJenisSuratName(pengajuan.jenis_surat),
      tanggal_request: pengajuan.tanggal_request,
      status: pengajuan.status,
      file_pengantar: pengajuan.file_pengantar,
      komentar_admin: pengajuan.komentar_admin,
      createdAt: pengajuan.createdAt,
      updatedAt: pengajuan.updatedAt
    };

    console.log('Rendering detail-pengajuan with data:', detailData);
    res.render('detail-pengajuan', {
      data: detailData
    });
  } catch (error) {
    console.error('Error getDetail:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil detail pengajuan');
  }
};