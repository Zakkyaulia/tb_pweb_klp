const express = require('express');
const path = require('path');
const app = express();

const adminRoutes = require('./src/routes/adminroute');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Secara spesifik melayani file dari folder 'uploads' di dalam 'src'
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware untuk parsing JSON dan form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Rute utama aplikasi


app.use('/admin', adminRoutes); // Gunakan adminroute dengan prefix /admin

app.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
