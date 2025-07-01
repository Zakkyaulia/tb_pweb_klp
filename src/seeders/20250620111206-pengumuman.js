'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update template_file untuk setiap jenis surat
    await queryInterface.bulkUpdate('surat', [
      { template_file: 'template-skak.pdf' },
      { template_file: 'template-skl.pdf' },
      { template_file: 'template-sbss.pdf' },
      { template_file: 'template-sak.pdf' },
      { template_file: 'template-sktmb.pdf' }
    ], {
      jenis_surat: ['SKAK', 'SKL', 'SBSS', 'SAK', 'SKTMB']
    });
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
