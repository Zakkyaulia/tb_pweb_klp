'use strict';
const {
  Model
} =
require('sequelize');

// Model untuk tabel surat
module.exports =
(sequelize, DataTypes) => {
  class surat extends Model {
    static associate(models) {
      // Tambahkan relasi jika diperlukan
    }
  }
  surat.init({
    surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jenis_surat: DataTypes.STRING,
    template_file: DataTypes.BLOB('long')
  }, {
    sequelize,
    modelName: 'surat',
    tableName: 'surat'
  });
  return surat;
};