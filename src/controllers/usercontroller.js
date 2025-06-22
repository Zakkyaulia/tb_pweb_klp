// src/controllers/userController.js
const { users: User, Sequelize } = require('../models');
const Op = Sequelize.Op;

const fetchAllUsers = async (jurusan, page, nim) => {
  try {
    const findOptions = {
      where: {
        role: 'user' // Selalu filter berdasarkan role 'user'
      }
    };

    if (jurusan && jurusan !== 'Semua') {
      findOptions.where.jurusan = jurusan;
    }
    
    if (nim) {
      findOptions.where.nim = {
        [Op.like]: `%${nim}%`
      };
    }

    // Hanya terapkan paginasi jika 'page' diberikan
    if (page) {
      const limit = 10;
      const offset = (page - 1) * limit;
      findOptions.limit = limit;
      findOptions.offset = offset;
    }

    const { count, rows } = await User.findAndCountAll(findOptions);

    const totalPages = page ? Math.ceil(count / 10) : 1;

    return { users: rows, totalPages: totalPages, currentPage: page || 1, totalUsers: count };
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