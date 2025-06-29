'use strict';
const {
  Model
} =
require('sequelize');

// Model untuk tabel pengumuman
module.exports =
(sequelize, DataTypes) => {
  class pengumuman extends Model {
    static associate(models) {
      // Tambahkan relasi jika diperlukan
    }
  }
  pengumuman.init({
    judul: DataTypes.STRING,
    isi: DataTypes.TEXT,
    tanggal_posting: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'pengumuman',
  });
  return pengumuman;
};