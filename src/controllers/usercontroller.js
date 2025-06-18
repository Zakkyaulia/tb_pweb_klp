// src/controllers/userController.js
const { User } = require('../models');

const deleteUserByNim = async (req, res) => {
  const { nim } = req.params;

  try {
    const deleted = await User.destroy({
      where: { nim }
    });

    if (deleted) {
      return res.status(200).json({ message: `User dengan NIM ${nim} berhasil dihapus.` });
    } else {
      return res.status(404).json({ message: `User dengan NIM ${nim} tidak ditemukan.` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus user.' });
  }
};

const getUserByNim = async (req, res) => {
  const { nim } = req.params;

  try {
    const user = await User.findOne({
      where: { nim }
    });

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: `User dengan NIM ${nim} tidak ditemukan.` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mencari user.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar user.' });
  }
};

module.exports = {
  deleteUserByNim,
  getUserByNim,
  getAllUsers
};
