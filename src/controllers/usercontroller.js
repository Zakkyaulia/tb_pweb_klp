// src/controllers/userController.js
const { User } = require('../models');

const fetchAllUsers = async () => {
  try {
    const users = await User.findAll({
      where: {
        role: 'user' // Hanya ambil pengguna dengan role 'user'
      }
    });
    return users; // Kembalikan data mentah untuk rendering
  } catch (error) {
    console.error(error);
    throw error; // Lempar error agar ditangani di rute
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar user.' });
  }
};

// Fungsi untuk menampilkan dashboard user
const getDashboard = (req, res) => {
    res.render('user/userdashboard');
};

module.exports = {
  getAllUsers,
  fetchAllUsers, // Ekspor fungsi ini untuk digunakan di rute
  getDashboard
};