'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class request_surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  request_surat.init({
    user_id: DataTypes.INTEGER,
    surat_id: DataTypes.STRING,
    tanggal_request: DataTypes.DATE,
    status: DataTypes.STRING,
    file_pengantar: DataTypes.STRING,
    komentar_admin: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'request_surat',
  });
  return request_surat;
};