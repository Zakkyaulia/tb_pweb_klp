const { request_surat, User } = require('../models');
const puppeteer = require('puppeteer');

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

exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        console.log('Attempting to delete user with ID:', user_id); // Debug log
        const user = await User.findByPk(user_id);
        console.log('Found user:', user); // Debug log
        
        if (user) {
            // Hapus semua request surat yang terkait dengan user ini terlebih dahulu
            await request_surat.destroy({
                where: { user_id: user_id }
            });
            console.log('Related request_surats deleted'); // Debug log
            
            // Kemudian hapus user
            await user.destroy();
            console.log('User deleted successfully'); // Debug log
            res.status(200).json({ success: true, message: 'User berhasil dihapus' });
        } else {
            console.log('User not found'); // Debug log
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user: ' + error.message });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const { jenis_surat, tanggal } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Buat filter query
        const whereClause = {};
        if (jenis_surat && jenis_surat !== 'Semua') {
            whereClause.jenis_surat = jenis_surat;
        }
        if (tanggal) {
            // Menggunakan fungsi DATE dari sequelize untuk membandingkan tanggal saja
            whereClause.tanggal_request = request_surat.sequelize.where(
                request_surat.sequelize.fn('DATE', request_surat.sequelize.col('tanggal_request')),
                '=',
                tanggal
            );
        }

        // Ambil semua jenis surat yang unik untuk dropdown filter
        const allJenisSurat = await request_surat.findAll({
            attributes: [[request_surat.sequelize.fn('DISTINCT', request_surat.sequelize.col('jenis_surat')), 'jenis_surat']],
            raw: true
        }).then(results => results.map(r => r.jenis_surat));

        // Ambil data yang difilter dengan paginasi
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

exports.generatePDFForDiproses = async (req, res) => {
    try {
        // Ambil semua data permintaan dengan status 'diproses'
        const requests = await request_surat.findAll({
            where: { status: 'diproses' },
            order: [['tanggal_request', 'DESC']]
        });

        // Generate HTML content untuk PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Laporan Permintaan Diproses</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #059669;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #059669;
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #059669;
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-style: italic;
                }
                .summary {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f0f9ff;
                    border-left: 4px solid #059669;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LAPORAN PERMINTAAN SURAT</h1>
                <p>Status: Diproses</p>
                <p>Tanggal Generate: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
            
            ${requests.length > 0 ? `
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
                    ${requests.map((request, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${request.nama || 'N/A'}</td>
                            <td>${request.nim || 'N/A'}</td>
                            <td>${request.tanggal_request ? new Date(request.tanggal_request).toLocaleDateString('id-ID') : 'N/A'}</td>
                            <td>${request.jenis_surat}</td>
                            <td>${request.file_pengantar ? 'Lengkap' : 'Tidak Lengkap'}</td>
                            <td>${request.komentar_admin || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="summary">
                <strong>Ringkasan:</strong><br>
                Total permintaan diproses: ${requests.length}<br>
                Permintaan dengan file lengkap: ${requests.filter(r => r.file_pengantar).length}<br>
                Permintaan tanpa file: ${requests.filter(r => !r.file_pengantar).length}
            </div>
            ` : `
            <div class="no-data">
                Tidak ada data permintaan dengan status diproses
            </div>
            `}
        </body>
        </html>
        `;

        // Launch browser dan generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            },
            printBackground: true
        });

        await browser.close();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="permintaan-diproses-${new Date().toISOString().split('T')[0]}.pdf"`);
        
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat generate PDF' 
        });
    }
};

exports.generatePDFForSelesai = async (req, res) => {
    try {
        // Ambil semua data permintaan dengan status 'selesai'
        const requests = await request_surat.findAll({
            where: { status: 'selesai' },
            order: [['tanggal_request', 'DESC']]
        });

        // Generate HTML content untuk PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Laporan Permintaan Selesai</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #059669;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #059669;
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #059669;
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-style: italic;
                }
                .summary {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f0f9ff;
                    border-left: 4px solid #059669;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LAPORAN PERMINTAAN SURAT</h1>
                <p>Status: Selesai</p>
                <p>Tanggal Generate: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
            
            ${requests.length > 0 ? `
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
                    ${requests.map((request, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${request.nama || 'N/A'}</td>
                            <td>${request.nim || 'N/A'}</td>
                            <td>${request.tanggal_request ? new Date(request.tanggal_request).toLocaleDateString('id-ID') : 'N/A'}</td>
                            <td>${request.jenis_surat}</td>
                            <td>${request.file_pengantar ? 'Lengkap' : 'Tidak Lengkap'}</td>
                            <td>${request.komentar_admin || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="summary">
                <strong>Ringkasan:</strong><br>
                Total permintaan selesai: ${requests.length}
            </div>
            ` : `
            <div class="no-data">
                Tidak ada data permintaan dengan status selesai
            </div>
            `}
        </body>
        </html>
        `;

        // Launch browser dan generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            },
            printBackground: true
        });

        await browser.close();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="permintaan-selesai-${new Date().toISOString().split('T')[0]}.pdf"`);
        
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat generate PDF' 
        });
    }
};

exports.generatePDFForDiajukan = async (req, res) => {
    try {
        // Ambil semua data permintaan dengan status 'diajukan'
        const requests = await request_surat.findAll({
            where: { status: 'diajukan' },
            order: [['tanggal_request', 'DESC']]
        });

        // Generate HTML content untuk PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Laporan Permintaan Diajukan</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #059669;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #059669;
                    margin: 0;
                    font-size: 24px;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #059669;
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-style: italic;
                }
                .summary {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f0f9ff;
                    border-left: 4px solid #059669;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>LAPORAN PERMINTAAN SURAT</h1>
                <p>Status: Diajukan</p>
                <p>Tanggal Generate: ${new Date().toLocaleDateString('id-ID')}</p>
            </div>
            
            ${requests.length > 0 ? `
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
                    ${requests.map((request, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${request.nama || 'N/A'}</td>
                            <td>${request.nim || 'N/A'}</td>
                            <td>${request.tanggal_request ? new Date(request.tanggal_request).toLocaleDateString('id-ID') : 'N/A'}</td>
                            <td>${request.jenis_surat}</td>
                            <td>${request.file_pengantar ? 'Lengkap' : 'Tidak Lengkap'}</td>
                            <td>${request.komentar_admin || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="summary">
                <strong>Ringkasan:</strong><br>
                Total permintaan diajukan: ${requests.length}
            </div>
            ` : `
            <div class="no-data">
                Tidak ada data permintaan dengan status diajukan
            </div>
            `}
        </body>
        </html>
        `;

        // Launch browser dan generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            },
            printBackground: true
        });

        await browser.close();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="permintaan-diajukan-${new Date().toISOString().split('T')[0]}.pdf"`);
        
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat generate PDF' 
        });
    }
};

