'use strict';
const {
  Model
} =
require('sequelize');
module.exports =
(sequelize, DataTypes) => {
  class pengumuman extends Model {
    static associate(models) {
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