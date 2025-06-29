'use strict';
const {
  Model
} = require('sequelize');

// Model untuk tabel request_surats
module.exports = (sequelize, DataTypes) => {
  class request_surat extends Model {
    // Relasi ke tabel user
    static associate(models) {
      request_surat.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  request_surat.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    jenis_surat: DataTypes.STRING,
    tanggal_request: DataTypes.DATE,
    status: DataTypes.STRING,
    file_pengantar: DataTypes.BLOB('long'),
    komentar_admin: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'request_surat',
    tableName: 'request_surats'
  });
  return request_surat;
};