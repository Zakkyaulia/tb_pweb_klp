// src/controllers/userController.js
const { User } = require('../models');

// Fungsi untuk menampilkan halaman login
const getLoginPage = (req, res) => {
    // Cek jika ada pesan error dari redirect sebelumnya
    const error = req.query.error;
    res.render('login/login', { error: error });
};

// Fungsi untuk memproses login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (user) {
            // Validasi password (sementara tanpa hashing)
            if (user.password === password) {
                // Cek role user
                if (user.role === 'admin') {
                    // Simpan informasi user ke dalam session
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    };
                    // Jika admin, redirect ke halaman yang diminta
                    res.redirect('/admin/requests/diajukan');
                } else {
                    // Jika bukan admin (misal: mahasiswa), kembali ke login dengan error
                    res.redirect('/login?error=Access denied. Admin access only.');
                }
            } else {
                // Password salah
                res.redirect('/login?error=Invalid username or password');
            }
        } else {
            // User tidak ditemukan
            res.redirect('/login?error=Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login?error=An error occurred during login');
    }
};

// Fungsi untuk logout
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/requests/diajukan'); // Jika error, kembali ke dashboard
        }
        res.clearCookie('connect.sid'); // Hapus cookie session
        res.redirect('/login');
    });
};

const fetchAllUsers = async () => {
  try {
    const users = await User.findAll();
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

module.exports = {
  getAllUsers,
  fetchAllUsers, // Ekspor fungsi ini untuk digunakan di rute
  getLoginPage,
  loginUser,
  logoutUser
};