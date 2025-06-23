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