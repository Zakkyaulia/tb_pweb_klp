const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3002;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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
const authRoutes = require('./routes/authroute');

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/request/step1');
  } else {
    res.redirect('/login');
  }
});

app.use('/', authRoutes);
app.use('/request', requestRoutes.router);
app.use('/riwayat', riwayatRoutes.router);
app.use('/template', templateRoutes.router);

app.use((req, res, next) => {
  res.status(404).send("Maaf, halaman yang Anda cari tidak ditemukan!");
});

app.listen(PORT, () => {
  console.log(`Server jalan di 
    http://localhost:${PORT}`);
});