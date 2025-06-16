'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_surats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user', 
          key: 'user_id'
        },
      },
      surat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'surat', 
          key: 'surat_id'
        },
      },
      tanggal_request: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      file_pengantar: {
        type: Sequelize.STRING
      },
      komentar_admin: {
        type: Sequelize.TEXT
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('request_surats');
  }
};