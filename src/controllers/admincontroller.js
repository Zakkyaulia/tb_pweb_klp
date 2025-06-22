const { request_surat, users, pengumuman, surat } = require('../models');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const userController = require('./usercontroller');

// DASHBOARD
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await users.count({ where: { role: 'user' } });
        const totalRequests = await request_surat.count();
        const pendingRequests = await request_surat.count({ where: { status: 'diajukan' } });
        const processedRequests = await request_surat.count({ where: { status: 'diproses' } });
        const completedRequests = await request_surat.count({ where: { status: 'selesai' } });

        res.render('admin/dashboard', {
            stats: {
                totalUsers,
                totalRequests,
                pendingRequests,
                processedRequests,
                completedRequests
            },
            user: req.session.user // Mengirim data user ke template
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).send('Gagal mengambil data dashboard');
    }
};


// KELOLA PENGGUNA
exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await users.findByPk(user_id);
        if (user) {
            await request_surat.destroy({ where: { user_id: user_id } });
            await user.destroy();
            res.status(200).json({ success: true, message: 'User berhasil dihapus' });
        } else {
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user: ' + error.message });
    }
};

// KELOLA REQUEST SURAT
exports.getAllRequests = async (req, res) => {
    try {
        const { jenis_surat, tanggal } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (jenis_surat && jenis_surat !== 'Semua') {
            whereClause.jenis_surat = jenis_surat;
        }
        if (tanggal) {
            whereClause.tanggal_request = request_surat.sequelize.where(
                request_surat.sequelize.fn('DATE', request_surat.sequelize.col('tanggal_request')),
                '=',
                tanggal
            );
        }

        const allJenisSurat = await request_surat.findAll({
            attributes: [[request_surat.sequelize.fn('DISTINCT', request_surat.sequelize.col('jenis_surat')), 'jenis_surat']],
            raw: true
        }).then(results => results.map(r => r.jenis_surat));

        const { count, rows } = await request_surat.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['tanggal_request', 'DESC']]
        });

        const totalPages = Math.ceil(count / limit) || 1;

        res.render('admin/ajuansemua', {
            requests: rows || [],
            page: page,
            totalPages: totalPages,
            allJenisSurat: allJenisSurat,
            currentFilters: { jenis_surat, tanggal },
            query: req.query
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).render('admin/ajuansemua', { 
            requests: [], 
            error: 'Terjadi kesalahan saat mengambil data permintaan.',
            allJenisSurat: [],
            currentFilters: req.query,
            page: 1,
            totalPages: 1,
            query: req.query
        });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await request_surat.findByPk(id);
        if (request) {
            await request.update({ status });
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Permintaan tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
};

exports.updateRequestComment = async (req, res) => {
    const { id } = req.params;
    const { komentar_admin } = req.body;
    
    console.log('updateRequestComment called with:', { id, komentar_admin, body: req.body });
    
    try {
        const request = await request_surat.findByPk(id);
        if (request) {
            console.log('Found request:', request.id);
            await request.update({ komentar_admin });
            console.log('Comment updated successfully');
            res.status(200).json({ success: true });
        } else {
            console.log('Request not found with id:', id);
            res.status(404).json({ success: false, message: 'Permintaan tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, message: 'Error updating comment' });
    }
};

// KELOLA PENGUMUMAN
exports.getAllPengumuman = async (req, res) => {
    try {
        const announcements = await pengumuman.findAll({ order: [['tanggal_posting', 'DESC']] });
        res.render('admin/pengumuman', { data: announcements });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengambil data pengumuman.");
    }
};

exports.showFormPengumuman = (req, res) => {
    res.render('admin/pengumuman_form', {
        data: null,
        formAction: 'add',
        success: req.query.success === 'true'
    });
};

exports.createPengumuman = async (req, res) => {
    try {
        const { judul, tanggal, isi } = req.body;
        await pengumuman.create({
            judul,
            isi,
            tanggal_posting: tanggal
        });
        res.redirect('/admin/pengumuman/add?success=true');
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal membuat pengumuman.");
    }
};

exports.showEditFormPengumuman = async (req, res) => {
    try {
        const announcement = await pengumuman.findByPk(req.params.id);
        res.render('admin/pengumuman_form', {
            data: announcement,
            formAction: `edit/${req.params.id}`,
            success: req.query.success === 'true'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal mengambil data pengumuman untuk diedit.");
    }
};

exports.updatePengumuman = async (req, res) => {
    try {
        const { judul, tanggal, isi } = req.body;
        await pengumuman.update({
            judul,
            isi,
            tanggal_posting: tanggal
        }, { where: { id: req.params.id } });
        res.redirect(`/admin/pengumuman/edit/${req.params.id}?success=true`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memperbarui pengumuman.");
    }
};

exports.deletePengumuman = async (req, res) => {
    try {
        await pengumuman.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/pengumuman');
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal menghapus pengumuman.");
    }
};

// KELOLA TEMPLATE SURAT
exports.getAllSurat = async (req, res) => {
    try {
        const templates = await surat.findAll();
        res.render('admin/template', { templates, success: req.query.success === 'true' });
    } catch (error) {
        console.error('Error in getAllSurat:', error);
        res.status(500).send('Gagal mengambil data template surat');
    }
};

exports.showFormSurat = (req, res) => {
    res.render('admin/template_form', { 
        template: null, 
        error: req.query.error || null,
        success: req.query.success === 'true'
    });
};

exports.createSurat = async (req, res) => {
    const { name } = req.body;
    const template_file = req.file ? req.file.filename : null;
    try {
        if (!name || !template_file) {
            return res.redirect('/admin/template/add?error=Nama+dan+file+template+wajib+diisi');
        }
        await surat.create({ jenis_surat: name, template_file });
        res.redirect('/admin/template/add?success=true');
    } catch (error) {
        console.error('Error in createSurat:', error);
        res.redirect(`/admin/template/add?error=${encodeURIComponent(error.message)}`);
    }
};

exports.deleteSurat = async (req, res) => {
    try {
        const template = await surat.findByPk(req.params.id);
        if (template && template.template_file) {
            const physicalPath = path.join(__dirname, '..', 'uploads', template.template_file);
            if (fs.existsSync(physicalPath)) {
                fs.unlinkSync(physicalPath);
            }
        }
        await surat.destroy({ where: { surat_id: req.params.id } });
        res.redirect('/admin/template?success=true');
    } catch (error) {
        console.error('Error in deleteSurat:', error);
        res.status(500).send('Gagal menghapus template surat');
    }
};

exports.showEditFormSurat = async (req, res) => {
    try {
        const template = await surat.findByPk(req.params.id);
        if (!template) {
            return res.status(404).send('Template tidak ditemukan');
        }
        res.render('admin/template_form', { 
            template, 
            error: req.query.error || null,
            success: req.query.success === 'true'
        });
    } catch (error) {
        console.error('Error in showEditFormSurat:', error);
        res.status(500).send('Gagal mengambil data template untuk diedit');
    }
};

exports.updateSurat = async (req, res) => {
    const { name } = req.body;
    try {
        const template = await surat.findByPk(req.params.id);
        if (!template) {
            return res.status(404).send('Template tidak ditemukan');
        }
        
        let templateFile = template.template_file;
        if (req.file) {
            if (template.template_file) {
                const oldPath = path.join(__dirname, '..', 'uploads', template.template_file);
                if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            templateFile = req.file.filename;
        }
        await surat.update({ jenis_surat: name, template_file: templateFile }, { where: { surat_id: req.params.id } });
        res.redirect(`/admin/template/edit/${req.params.id}?success=true`);
    } catch (error) {
        console.error('Error in updateSurat:', error);
        res.redirect(`/admin/template/edit/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
};


// FUNGSI PDF (Contoh, perlu disesuaikan)
const generatePdfCommon = async (res, data, title, status) => {
    let browser;
    try {
        const today = new Date();
        const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        // Calculate summary
        const totalPermintaan = data.length;
        const denganFileLengkap = data.filter(d => d.file_pengantar).length;
        const tanpaFile = totalPermintaan - denganFileLengkap;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        color: #333;
                        font-size: 12px;
                    }
                    .container {
                        width: 95%;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #34A853;
                        padding-bottom: 15px;
                    }
                    .header h1 {
                        font-size: 24px;
                        color: #34A853;
                        margin: 0;
                        font-weight: 500;
                        letter-spacing: 1px;
                    }
                    .header p {
                        margin: 5px 0 0;
                        color: #555;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #e0e0e0;
                        padding: 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #34A853;
                        color: white;
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 11px;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .summary {
                        background-color: #e8f5e9;
                        border-left: 5px solid #34A853;
                        padding: 15px;
                        margin-top: 20px;
                    }
                    .summary h3 {
                        margin: 0 0 10px;
                        color: #34A853;
                    }
                    .summary p {
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>LAPORAN PERMINTAAN SURAT</h1>
                        <p>Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                        <p>Tanggal Generate: ${formattedDate}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>NIM</th>
                                <th>Tanggal Request</th>
                                <th>Jenis Surat</th>
                                <th>File Pengantar</th>
                                <th>Komentar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((req, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${req.nama || 'N/A'}</td>
                                    <td>${req.nim || 'N/A'}</td>
                                    <td>${req.tanggal_request ? new Date(req.tanggal_request).toLocaleDateString('id-ID') : 'N/A'}</td>
                                    <td>${req.jenis_surat || 'N/A'}</td>
                                    <td>${req.file_pengantar ? 'Lengkap' : 'Tidak Lengkap'}</td>
                                    <td>${req.komentar_admin || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="summary">
                        <h3>Ringkasan:</h3>
                        <p>Total permintaan ${status}: ${totalPermintaan}</p>
                        <p>Permintaan dengan file lengkap: ${denganFileLengkap}</p>
                        <p>Permintaan tanpa file: ${tanpaFile}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="laporan-${status}-${Date.now()}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error in generatePdfCommon:', error);
        if (!res.headersSent) {
            res.status(500).send('Gagal membuat PDF: ' + error.message);
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

exports.generatePDFForDiproses = async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'diproses' } });
        await generatePdfCommon(res, requests, 'Laporan Permintaan Diproses', 'diproses');
    } catch (error) {
        console.error('Error generating PDF for diproses:', error);
        res.status(500).json({ error: 'Gagal generate PDF: ' + error.message });
    }
};

exports.generatePDFForSelesai = async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'selesai' } });
        await generatePdfCommon(res, requests, 'Laporan Permintaan Selesai', 'selesai');
    } catch (error) {
        console.error('Error generating PDF for selesai:', error);
        res.status(500).json({ error: 'Gagal generate PDF: ' + error.message });
    }
};

exports.generatePDFForDiajukan = async (req, res) => {
    try {
        const requests = await request_surat.findAll({ where: { status: 'diajukan' } });
        await generatePdfCommon(res, requests, 'Laporan Permintaan Diajukan', 'diajukan');
    } catch (error) {
        console.error('Error generating PDF for diajukan:', error);
        res.status(500).json({ error: 'Gagal generate PDF: ' + error.message });
    }
};

exports.generatePDFForUserDetail = async (req, res) => {
    try {
        const { jurusan, nim } = req.query;
        // Panggil fetchAllUsers tanpa parameter 'page' untuk mendapatkan semua data
        const { users } = await userController.fetchAllUsers(jurusan, null, nim);

        await generateUserListPDF(res, users, { jurusan, nim });

    } catch (error) {
        console.error('Error generating user detail PDF:', error);
        if (!res.headersSent) {
            res.status(500).send('Gagal membuat PDF: ' + error.message);
        }
    }
};

const generateUserListPDF = async (res, data, filters) => {
    let browser;
    try {
        const today = new Date();
        const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
        const filterInfo = `Jurusan: ${filters.jurusan || 'Semua'} | NIM: ${filters.nim || 'Semua'}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Laporan Detail Pengguna</title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        color: #333;
                        font-size: 12px;
                    }
                    .container {
                        width: 95%;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #34A853;
                        padding-bottom: 15px;
                    }
                    .header h1 {
                        font-size: 24px;
                        color: #34A853;
                        margin: 0;
                        font-weight: 500;
                        letter-spacing: 1px;
                    }
                    .header p {
                        margin: 5px 0 0;
                        color: #555;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #e0e0e0;
                        padding: 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #34A853;
                        color: white;
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 11px;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .summary {
                        background-color: #e8f5e9;
                        border-left: 5px solid #34A853;
                        padding: 15px;
                        margin-top: 20px;
                    }
                    .summary h3 {
                        margin: 0 0 10px;
                        color: #34A853;
                    }
                    .summary p {
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>LAPORAN DETAIL PENGGUNA</h1>
                        <p>Filter Aktif: ${filterInfo}</p>
                        <p>Tanggal Generate: ${formattedDate}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>NIM</th>
                                <th>Jurusan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((user, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${user.nama || 'N/A'}</td>
                                    <td>${user.nim || 'N/A'}</td>
                                    <td>${user.jurusan || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="summary">
                        <h3>Ringkasan:</h3>
                        <p>Total Pengguna: ${data.length}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="laporan-pengguna-${Date.now()}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error in generateUserListPDF:', error);
        if (!res.headersSent) {
            res.status(500).send('Gagal membuat PDF: ' + error.message);
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
