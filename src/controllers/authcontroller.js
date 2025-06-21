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
                    // Kirim respons sukses
                    return res.json({ success: true });
                } else {
                    // Kirim respons error jika bukan admin
                    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya untuk Admin.' });
                }
            } else {
                // Password salah
                return res.status(401).json({ success: false, message: 'Username atau password salah.' });
            }
        } else {
            // User tidak ditemukan
            return res.status(401).json({ success: false, message: 'Username atau password salah.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
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

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
}; 