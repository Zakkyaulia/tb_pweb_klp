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
      nim: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jenis_surat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tanggal_request: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM
        ('diajukan', 'diproses', 'selesai',),
        defaultValue: 'diajukan',
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