// Middleware untuk memeriksa apakah pengguna sudah login
exports.requireAuth = (req, res, next) => {
    if (req.session.user) {
      // Jika sudah login, lanjutkan ke request berikutnya
      next();
    } else {
      // Jika belum login, redirect ke halaman login dengan pesan error
      res.redirect('/login?error=Anda harus login untuk mengakses halaman ini.');
    }
  };
  
  // Middleware untuk memeriksa apakah pengguna adalah tamu (belum login)
  exports.requireGuest = (req, res, next) => {
    if (!req.session.user) {
      // Jika belum login, lanjutkan
      next();
    } else {
      // Jika sudah login, redirect ke halaman utama
      res.redirect('/request/step1');
    }
  }; 