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
      template_file: { // File untuk diunduh (.docx)
        type: Sequelize.STRING,
        allowNull: true
      },
      preview_file: { // File untuk dilihat (.png)
        type: Sequelize.STRING,
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

    // Seed initial data dengan nama file contoh
    await queryInterface.bulkInsert('surat', [
      { jenis_surat: 'SKAK', template_file: 'SKAK-template.docx', preview_file: 'SKAK-preview.png', createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SKL', template_file: 'SKL-template.docx', preview_file: 'SKL-preview.png', createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SBSS', template_file: 'SBSS-template.docx', preview_file: 'SBSS-preview.png', createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SAK', template_file: 'SAK-template.docx', preview_file: 'SAK-preview.png', createdAt: new Date(), updatedAt: new Date() },
      { jenis_surat: 'SKTMB', template_file: 'SKTMB-template.docx', preview_file: 'SKTMB-preview.png', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('surat');
  }
};