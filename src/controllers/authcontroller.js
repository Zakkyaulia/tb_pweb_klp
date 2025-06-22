const { User } = require('../models');

// Fungsi untuk menampilkan halaman login
const getLoginPage = (req, res) => {
    // Cek jika ada pesan error dari redirect sebelumnya
    const error = req.query.error;
    res.render('login', { error: error });
};

// Fungsi untuk memproses login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (user) {
            // Validasi password (sementara tanpa hashing)
            if (user.password === password) {
                // Simpan informasi user ke dalam session
                req.session.user = {
                    id: user.user_id, // Sesuaikan dengan primary key di model Anda
                    nama: user.nama,
                    nim: user.nim,
                    jurusan: user.jurusan,
                    username: user.username,
                };
                // Redirect ke halaman utama setelah login berhasil
                return res.redirect('/request/step1');

            } else {
                // Password salah
                return res.redirect('/login?error=Username atau password salah.');
            }
        } else {
            // User tidak ditemukan
            return res.redirect('/login?error=Username atau password salah.');
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.redirect('/login?error=Terjadi kesalahan pada server.');
    }
};

// Fungsi untuk logout
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            // Tetap redirect walau ada error
            return res.redirect('/'); 
        }
        res.clearCookie('connect.sid'); // Hapus cookie session
        res.redirect('/login?success=Anda berhasil logout.');
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
}; 