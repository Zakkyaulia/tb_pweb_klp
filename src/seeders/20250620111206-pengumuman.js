'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tidak perlu update template_file dengan string nama file
  },

  async down(queryInterface, Sequelize) {
    // Reset template_file menjadi null
    await queryInterface.bulkUpdate('surat', [
      { template_file: null },
      { template_file: null },
      { template_file: null },
      { template_file: null },
      { template_file: null }
    ], {
      jenis_surat: ['SKAK', 'SKL', 'SBSS', 'SAK', 'SKTMB']
    });
  }
};
