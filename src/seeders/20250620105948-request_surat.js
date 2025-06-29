'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tabel riwayat akan kosong di awal
    // Data hanya akan muncul ketika user mengajukan surat
    // Tidak perlu melakukan bulkInsert kosong
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('request_surats', null, {});
  },
};