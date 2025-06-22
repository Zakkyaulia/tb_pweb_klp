'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  surat.init({
    surat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    jenis_surat: DataTypes.STRING,
    template_file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'surat',
    tableName: 'surat',
    timestamps: true
  });
  return surat;
};