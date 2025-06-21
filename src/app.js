const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/templates', express.static(path.join(__dirname, 'public', 'templates')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRouter = require('./routes/index');
const requestRoutes = require('./routes/request');
const riwayatRoutes = require('./routes/riwayat');
const templateRoutes = require('./routes/template');

app.use('/', indexRouter);
app.use('/template', templateRoutes);
app.use('/request', requestRoutes.router);
app.use('/riwayat', riwayatRoutes.router);

app.use((req, res, next) => {
  res.status(404).send("Maaf, halaman yang Anda cari tidak ditemukan!");
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
  console.log(`Akses aplikasi di http://localhost:${PORT} untuk memulai.`);
});