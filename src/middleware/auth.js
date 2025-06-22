// src/middleware/auth.js

// Middleware untuk memeriksa otentikasi dan otorisasi admin
const isAuthenticated = (req, res, next) => {
    // Cek apakah ada data user di session
    if (req.session && req.session.user) {
        // Cek apakah role user adalah 'admin'
        if (req.session.user.role === 'admin') {
            // Jika user ada di session dan rolenya admin, lanjutkan ke rute berikutnya
            return next();
        } else {
            // Jika role bukan admin, kirim status 'Forbidden'
            // atau bisa juga redirect ke halaman tertentu dengan pesan error
            return res.status(403).send('Akses ditolak. Anda bukan admin.');
        }
    }
    // Jika tidak ada session atau data user, redirect ke halaman login
    res.redirect('/login');
};

// Middleware untuk memastikan pengguna adalah 'user'
const ensureUser = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'user') {
        return next();
    }
    // Redirect ke login jika bukan role 'user' atau belum login
    res.redirect('/login');
};

module.exports = {
    isAuthenticated,
    ensureUser
}; 