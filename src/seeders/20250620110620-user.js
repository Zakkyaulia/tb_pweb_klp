'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
      {
        nama: 'dimas',
        nim: '2001',
        jurusan: 'sistem informasi',
        email: 'dimas@gmail.com',
        username: 'dimas123',
        password: 'dimas123',
        createdAt: new Date('2025-06-18 14:13:06'),
        updatedAt: new Date('2025-06-18 14:13:06'),
      },
      {
        nama: 'ningsih',
        nim: '2002',
        jurusan: 'teknik komputer',
        email: 'ningsih@gmail.com',
        username: 'ningsih123',
        password: 'ningsih123',
        createdAt: new Date('2025-06-18 14:13:35'),
        updatedAt: new Date('2025-06-18 14:13:35'),
      },
      {
        nama: 'zakky',
        nim: '2003',
        jurusan: 'informatika',
        email: 'zakky@gmail.com',
        username: 'zakky123',
        password: 'zakky123',
        createdAt: new Date('2025-06-18 14:14:06'),
        updatedAt: new Date('2025-06-18 14:14:06'),
      },
      {
        nama: 'fahri',
        nim: '2004',
        jurusan: 'sistem informasi',
        email: 'fahri@gmail.com',
        username: 'fahri123',
        password: 'fahri123',
        createdAt: new Date('2025-06-18 14:14:06'),
        updatedAt: new Date('2025-06-18 14:14:06'),
      },
      {
        nama: 'rani',
        nim: '2005',
        jurusan: 'teknik elektro',
        email: 'rani@gmail.com',
        username: 'rani123',
        password: 'rani123',
        createdAt: new Date('2025-06-18 14:14:36'),
        updatedAt: new Date('2025-06-18 14:14:36'),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  },
};