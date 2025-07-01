const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-secret-key-just-for-dev', // Ganti dengan secret yang lebih aman di produksi
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Atur 'secure: true' jika menggunakan HTTPS
}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Upload
const upload = multer({ dest: 'uploads/' });

// Import routes
const authRoutes = require('./routes/authroute');
const { router: requestRoutes } = require('./routes/request');
// const adminRoutes = require('./routes/admin');
const { router: templateRoutes } = require('./routes/template');
const pengumumanRoutes = require('./routes/pengumuman');
const { router: riwayatRoutes } = require('./routes/riwayat');
const petunjukRoutes = require('./routes/petunjuk');

// Gunakan routes
app.use('/', authRoutes);
app.use('/request', requestRoutes);
// app.use('/', adminRoutes);
app.use('/template', templateRoutes);
app.use('/pengumuman', pengumumanRoutes);
app.use('/riwayat', riwayatRoutes);
app.use('/petunjuk', petunjukRoutes);

// Default route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Upload surat (bisa disesuaikan penempatannya nanti)
app.post('/upload-surat', upload.array('dokumen', 4), (req, res) => {
  console.log('Jenis Surat:', req.body.jenisSurat);
  console.log('Files:', req.files);
  res.send('Surat berhasil diupload!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

// database
const { sequelize } = require('./models');

sequelize.sync({ force: false })
  .then(() => console.log('Database dan model disinkronisasi'))
  .catch(err => console.log('Error sinkronisasi:', err));