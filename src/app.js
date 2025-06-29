const express = require('express');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware untuk parsing form dan static file
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi session
app.use(session({
    secret: 'your-secret-key-just-for-dev', // Ganti secret di produksi
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import dan gunakan routes utama
const authRoutes = require('./routes/authroute');
const { router: requestRoutes } = require('./routes/request');
// const adminRoutes = require('./routes/admin');
const { router: templateRoutes } = require('./routes/template');
const { router: riwayatRoutes } = require('./routes/riwayat');

// Gunakan routes
app.use('/', authRoutes);
app.use('/request', requestRoutes);
// app.use('/', adminRoutes);
app.use('/template', templateRoutes);
app.use('/riwayat', riwayatRoutes);

// Default route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
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