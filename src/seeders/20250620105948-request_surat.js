'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('request_surats', [
      {
        user_id: 6, // dimas
        jenis_surat: 'SKAK',
        tanggal_request: new Date('2025-06-04 17:53:25'),
        status: 'diajukan',
        file_pengantar: null,
        komentar_admin: null,
        createdAt: new Date('2025-06-20 12:53:25'),
        updatedAt: new Date('2025-06-20 12:53:25'),
      },
      {
        user_id: 7, // ningsih
        jenis_surat: 'SKAK',
        tanggal_request: new Date('2025-06-05 09:15:00'),
        status: 'diproses',
        file_pengantar: 'file1.pdf',
        komentar_admin: 'Sedang diverifikasi',
        createdAt: new Date('2025-06-20 13:00:00'),
        updatedAt: new Date('2025-06-20 13:00:00'),
      },
      {
        user_id: 8, // zakky
        jenis_surat: 'SBSS',
        tanggal_request: new Date('2025-06-06 14:30:00'),
        status: 'selesai',
        file_pengantar: null,
        komentar_admin: 'Selesai diproses',
        createdAt: new Date('2025-06-20 14:00:00'),
        updatedAt: new Date('2025-06-20 14:00:00'),
      },
      {
        user_id: 9, // fahri
        jenis_surat: 'SKL',
        tanggal_request: new Date('2025-06-07 16:45:00'),
        status: 'diajukan',
        file_pengantar: 'file2.pdf',
        komentar_admin: null,
        createdAt: new Date('2025-06-20 15:00:00'),
        updatedAt: new Date('2025-06-20 15:00:00'),
      },
      {
        user_id: 10, // rani
        jenis_surat: 'SKAK',
        tanggal_request: new Date('2025-06-08 10:20:00'),
        status: 'diproses',
        file_pengantar: null,
        komentar_admin: 'Menunggu dokumen tambahan',
        createdAt: new Date('2025-06-20 16:00:00'),
        updatedAt: new Date('2025-06-20 16:00:00'),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('request_surats', null, {});
  },
};