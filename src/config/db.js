/*
const { Sequelize } = require('sequelize');

// Konfigurasi koneksi database
const sequelize = new Sequelize('tb_pweb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Tes koneksi
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database berhasil.');
  } catch (error) {
    console.error('Tidak dapat terkoneksi ke database:', error);
  }
}

testConnection();

module.exports = sequelize;
*/