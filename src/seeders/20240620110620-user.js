'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        user_id: 1,
        nama: 'dimas',
        nim: '2001',
        email: 'dimas@example.com',
        username: 'dimas',
        password: 'dimas123',
        jurusan: 'Sistem Informasi',
        role: 'user',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        user_id: 2,
        nama: 'ningsih',
        nim: '2002',
        email: 'ningsih@example.com',
        username: 'ningsih',
        password: 'ningsih123',
        jurusan: 'Teknik Elektro',
        role: 'user',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        user_id: 3,
        nama: 'zakky',
        nim: '2003',
        email: 'zakky@example.com',
        username: 'zakky',
        password: 'zakky123',
        jurusan: 'Matematika',
        role: 'user',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        user_id: 4,
        nama: 'fahri',
        nim: '2004',
        email: 'fahri@example.com',
        username: 'fahri',
        password: 'fahri123',
        jurusan: 'Informatika',
        role: 'user',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        user_id: 5,
        nama: 'rani',
        nim: '2005',
        email: 'rani@example.com',
        username: 'rani',
        password: 'rani123',
        jurusan: 'Kimia',
        role: 'user',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      },
      {
        user_id: 6,
        nama: 'admin',
        nim: 'admin',
        email: 'admin@example.com',
        username: 'admin123',
        password: 'admin123',
        jurusan: 'Administrasi',
        role: 'admin',
        createdAt: new Date('2025-06-20 10:00:00'),
        updatedAt: new Date('2025-06-20 10:00:00'),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
