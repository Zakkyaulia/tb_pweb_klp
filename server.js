const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./src/config/db');

const userRoutes = require('./src/routes/userroute'); // Sesuaikan dengan nama file: userroute.js
const adminRoutes = require('./src/routes/adminroute'); // Sesuaikan dengan nama file: adminroute.js

// Mengatur EJS sebagai view engine
app.set('view engine', 'ejs');

// Mengarahkan Express ke folder views yang benar
app.set('views', path.join(__dirname, 'src', 'views'));

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk parsing JSON dan form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing ke halaman utama (opsional, arahkan ke default)
app.get('/', (req, res) => {
  res.redirect('/admin/requests/diajukan'); // Arahkan ke halaman default "Diproses"
});

// Route untuk API user
app.use('/api/users', userRoutes);

// Route untuk admin
app.use('/admin', adminRoutes);

// Sinkronisasi model dengan database
sequelize.sync({ force: false }) // force: true akan menghapus dan membangun ulang tabel
  .then(() => console.log('Database dan model disinkronisasi'))
  .catch(err => console.log('Error sinkronisasi:', err));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});