'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('surat', {
      surat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenis_surat: {
        type: Sequelize.STRING
      },
      template_file: {
        type: Sequelize.BLOB('long'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Seed initial data
    await queryInterface.bulkInsert('surat', [
      { jenis_surat: 'SKAK', template_file: null, createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SKL', template_file: null, createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SBSS', template_file: null, createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SAK', template_file: null, createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SKTMB', template_file: null, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('surat');
  }
};