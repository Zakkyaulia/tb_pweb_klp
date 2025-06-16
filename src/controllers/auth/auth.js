const bcrypt = require('bcrypt');
const { user } = require('../../models');

exports.login = async (req, res) => {
  const { nim } = req.body;

  try {
    const foundUser = await user.findOne({ where: { nim } });

    if (!foundUser) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Simpan user ke session
    req.session.user = {
      id: foundUser.user_id,
      nama: foundUser.nama,
      role: foundUser.role
    };

    return res.status(200).json({ message: 'Login berhasil', user: req.session.user });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Gagal logout' });
    res.clearCookie('connect.sid'); // cookie session default
    return res.json({ message: 'Logout berhasil' });
  });
};

exports.getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Belum login' });
  }
  return res.json({ user: req.session.user });
};
