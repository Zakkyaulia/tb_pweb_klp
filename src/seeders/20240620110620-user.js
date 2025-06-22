'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        nama: 'dimas',
        nim: '2001',
        email: 'dimas@gmail.com',
        jurusan: 'Sistem Informasi',
        createdAt: new Date('2025-06-18 14:13:06'),
        updatedAt: new Date('2025-06-18 14:13:06'),
      },
      {
        nama: 'ningsih',
        nim: '2002',
        email: 'ningsih@gmail.com',
        jurusan: 'Teknik Komputer',
        createdAt: new Date('2025-06-18 14:13:35'),
        updatedAt: new Date('2025-06-18 14:13:35'),
      },
      {
        nama: 'zakky',
        nim: '2003',
        email: 'zakky@gmail.com',
        jurusan: 'Informatika',
        createdAt: new Date('2025-06-18 14:14:06'),
        updatedAt: new Date('2025-06-18 14:14:06'),
      },
      {
        nama: 'fahri',
        nim: '2004',
        email: 'fahri@gmail.com',
        jurusan: 'Sistem Informasi',
        createdAt: new Date('2025-06-18 14:14:06'),
        updatedAt: new Date('2025-06-18 14:14:06'),
      },
      {
        nama: 'rani',
        nim: '2005',
        email: 'rani@gmail.com',
        jurusan: 'Teknik Elektro',
        createdAt: new Date('2025-06-18 14:14:36'),
        updatedAt: new Date('2025-06-18 14:14:36'),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  },
};