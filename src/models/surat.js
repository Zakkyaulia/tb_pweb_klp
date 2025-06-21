'use strict';
const {
  Model
} =
require('sequelize');
module.exports =
(sequelize, DataTypes) => {
  class surat extends Model {
    static associate(models) {
    }
  }
  surat.init({
    surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jenis_surat: DataTypes.STRING,
    template_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'surat',
    tableName: 'surat'
  });
  return surat;
};