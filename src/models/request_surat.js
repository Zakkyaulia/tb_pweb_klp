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
      request_surat.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  request_surat.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    nim: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    jenis_surat: DataTypes.STRING,
    tanggal_request: DataTypes.DATE,
    status: DataTypes.ENUM('diajukan', 'diproses', 'selesai'),
    file_pengantar: DataTypes.STRING,
    komentar_admin: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'request_surat',
    timestamps: true
  });
  return request_surat;
};