'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('user', 'jurusan', {
        type: Sequelize.STRING,
        allowNull: true
      });
    } catch (error) {
      // If column already exists, ignore the error
      console.log('Column jurusan might already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('user', 'jurusan');
    } catch (error) {
      console.log('Column jurusan might not exist');
    }
  }
};
