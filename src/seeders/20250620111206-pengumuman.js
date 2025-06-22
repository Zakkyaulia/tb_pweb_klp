'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pengumumans', [
      {
        judul: 'Pengumuman Libur Semester',
        isi: 'Diumumkan kepada seluruh mahasiswa bahwa libur semester akan dimulai tanggal 15 Juni 2025.',
        tanggal_posting: new Date('2025-06-15 08:00:00'),
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        judul: 'Jadwal Ujian Akhir Semester',
        isi: 'Ujian Akhir Semester akan dilaksanakan pada tanggal 20-25 Juni 2025. Silakan cek jadwal masing-masing mata kuliah.',
        tanggal_posting: new Date('2025-06-10 09:00:00'),
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        judul: 'Pendaftaran Beasiswa',
        isi: 'Pendaftaran beasiswa untuk semester berikutnya dibuka mulai tanggal 1 Juli 2025. Silakan daftar melalui portal akademik.',
        tanggal_posting: new Date('2025-06-25 10:00:00'),
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        judul: 'Workshop Programming',
        isi: 'Workshop programming akan diadakan pada tanggal 30 Juni 2025. Pendaftaran dibuka untuk semua jurusan.',
        tanggal_posting: new Date('2025-06-28 11:00:00'),
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        judul: 'Maintenance Sistem Akademik',
        isi: 'Sistem akademik akan mengalami maintenance pada tanggal 5 Juli 2025 pukul 22:00-02:00 WIB.',
        tanggal_posting: new Date('2025-07-01 12:00:00'),
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pengumumans', null, {});
  }
};
