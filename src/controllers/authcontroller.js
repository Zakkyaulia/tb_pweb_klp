const { User } = require('../models');

// Tampilkan halaman login
const getLoginPage = (req, res) => {
    const error = req.query.error;
    res.render('login', { error: error });
};

// Proses login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (user) {
            if (user.password === password) {
                // Simpan user ke session setelah login
                req.session.user = {
                    id: user.user_id,
                    nama: user.nama,
                    nim: user.nim,
                    jurusan: user.jurusan,
                    username: user.username,
                };
                return res.redirect('/request/step1');
            } else {
                return res.redirect('/login?error=Username atau password salah.');
            }
        } else {
            return res.redirect('/login?error=Username atau password salah.');
        }
    } catch (error) {
        return res.redirect('/login?error=Terjadi kesalahan pada server.');
    }
};

// Logout user dan hapus session
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); 
        }
        res.clearCookie('connect.sid');
        res.redirect('/login?success=Anda berhasil logout.');
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
}; 