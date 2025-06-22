const express = require('express');
const app = express();
const path = require('path');
const db = require('./src/models'); // Mengimpor dari models/index.js
const session = require('express-session');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./src/routes/adminroute');
const userRoutes = require('./src/routes/userroute');
const authRoutes = require('./src/routes/authroute'); // Impor rute otentikasi

// Mengatur EJS sebagai view engine
app.set('view engine', 'ejs');

// Mengarahkan Express ke folder views yang benar
app.set('views', path.join(__dirname, 'src', 'views'));

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Secara spesifik melayani file dari folder 'uploads' di dalam 'src'
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Middleware untuk parsing JSON dan form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk session
app.use(cookieParser());
app.use(session({
    secret: 'ini-adalah-secret-key-yang-sangat-rahasia', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

// Rute utama aplikasi
// Rute untuk halaman "Diajukan" harus didefinisikan sebelum rute lain yang mungkin menangani "/"
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Gunakan Rute
app.use('/', authRoutes); // Gunakan rute otentikasi untuk path dasar
app.use('/admin', adminRoutes);
app.use('/user', userRoutes); // Gunakan rute pengguna di bawah '/user'

// Sinkronisasi model dengan database
db.sequelize.sync({ force: false })
  .then(() => console.log('Database dan model disinkronisasi'))
  .catch(err => console.log('Error sinkronisasi:', err));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});
