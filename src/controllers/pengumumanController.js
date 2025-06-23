const { pengumuman } = require('../models');

exports.getAllPengumuman = async (req, res) => {
    try {
        // Coba ambil data dari database
        let pengumumanData = await pengumuman.findAll({
            order: [['tanggal_posting', 'DESC']]
        });

        // Jika tidak ada data di database, gunakan data dummy
        if (!pengumumanData || pengumumanData.length === 0) {
            pengumumanData = [
                {
                    id: 1,
                    judul: 'Pengajuan Surat Lulus Wajib Scan Transkrip',
                    isi: 'Pengajuan surat lulus kini wajib menyertakan scan transkrip.',
                    tanggal_posting: new Date('2025-06-10'),
                    createdAt: new Date('2025-06-10'),
                    updatedAt: new Date('2025-06-11')
                },
                {
                    id: 2,
                    judul: 'Maintenance Sistem SIPAS',
                    isi: 'Maintenance sistem dijadwalkan pada 12 Juni 2025 pukul 00:00–04:00 WIB.',
                    tanggal_posting: new Date('2025-06-05'),
                    createdAt: new Date('2025-06-05'),
                    updatedAt: new Date('2025-06-05')
                },
                {
                    id: 3,
                    judul: 'Perubahan Jam Operasional',
                    isi: 'Mulai 1 Juli 2025, jam operasional layanan surat berubah menjadi 08:00-16:00 WIB.',
                    tanggal_posting: new Date('2025-06-01'),
                    createdAt: new Date('2025-06-01'),
                    updatedAt: new Date('2025-06-02')
                }
            ];
        }
        
        res.render('pengumuman', { pengumuman: pengumumanData, active: 'Pengumuman', error: null });
    } catch (error) {
        console.error('Error fetching pengumuman:', error);
        res.status(500).render('pengumuman', {
            pengumuman: [],
            error: 'Gagal memuat data pengumuman'
        });
    }
}; 