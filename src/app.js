const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Upload
const upload = multer({ dest: 'uploads/' });

// Import routes
const authRoutes = require('./routes/auth');
const mahasiswaRoutes = require('./routes/mahasiswa');
const adminRoutes = require('./routes/admin');
const templateRoutes = require('./routes/template');
const pengumumanRoutes = require('./routes/pengumuman');

// Gunakan routes
app.use('/', authRoutes);
app.use('/', mahasiswaRoutes);
app.use('/', adminRoutes);
app.use('/template', templateRoutes);
app.use('/pengumuman', pengumumanRoutes);

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

const historyRoutes = require('./routes/history');
app.use('/history', historyRoutes);



// database
const sequelize = require('./config/db');

sequelize.sync({ force: false })
  .then(() => console.log('Database dan model disinkronisasi'))
  .catch(err => console.log('Error sinkronisasi:', err));