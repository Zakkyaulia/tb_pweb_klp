// controllers/admincontroller.js
const db = require('../models');
const { Op } = require('sequelize');
const Pengumuman = db.pengumuman;
const Surat = db.surat;
const User = db.User;
const RequestSurat = db.request_surat;

// ------------------ DASHBOARD ------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUser = await User.count();
    const totalRequest = await RequestSurat.count();
    const newRequest = await RequestSurat.count({ where: { status: 'diajukan' } });
    const inProcess = await RequestSurat.count({ where: { status: 'diproses' } });
    const finished = await RequestSurat.count({ where: { status: 'selesai' } });

    res.render('admin/dashboard', {
      name: 'Admin SIPAS',
      data: {
        totalUser,
        totalRequest,
        newRequest,
        inProcess,
        finished
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengambil data dashboard');
  }
};


// ------------------ PENGUMUMAN ------------------
exports.getAllPengumuman = async (req, res) => {
  try {
    const data = await Pengumuman.findAll({
      order: [['tanggal_posting', 'DESC']]
    });
    res.render('admin/pengumuman', { data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengambil data pengumuman');
  }
};

exports.showFormPengumuman = (req, res) => {
  res.render('admin/pengumuman_form', {
    data: null,
    formAction: 'add',
    success: req.query.success || null,
    error: null
  });
};

exports.createPengumuman = async (req, res) => {
  try {
    const { judul, isi, tanggal } = req.body;
    await Pengumuman.create({
      judul,
      isi,
      tanggal_posting: tanggal
    });
    res.redirect('/admin/pengumuman?success=Pengumuman berhasil di upload!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menyimpan pengumuman');
  }
};

exports.showEditFormPengumuman = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Pengumuman.findByPk(id);
        if (!item) return res.sendStatus(404);
        res.render('admin/pengumuman_form', {
            data: item,
            formAction: `edit/${id}`,
            success: null,
            error: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data pengumuman untuk diedit');
    }
};

exports.updatePengumuman = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, tanggal } = req.body;
        await Pengumuman.update({
            judul,
            isi,
            tanggal_posting: tanggal
        }, { where: { id } });
        res.redirect('/admin/pengumuman');
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal memperbarui pengumuman');
    }
};

exports.deletePengumuman = async (req, res) => {
  try {
    const { id } = req.params;
    await Pengumuman.destroy({ where: { id } });
    res.redirect('/admin/pengumuman');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menghapus pengumuman');
  }
};


// ------------------ SURAT (TEMPLATE) ------------------
exports.getAllSurat = async (req, res) => {
    try {
        const templates = await Surat.findAll({ order: [['createdAt', 'DESC']] });
        res.render('admin/template', {
            templates,
            success: req.query.success
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data template');
    }
};

exports.showFormSurat = (req, res) => {
    res.render('admin/template_form', {
        template: null,
        error: null,
        success: req.query.success ? true : null
    });
};

exports.createSurat = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.render('admin/template_form', {
                template: null,
                error: 'File tidak valid atau tidak dipilih. Hanya file PDF yang diperbolehkan!',
                success: null
            });
        }
        await Surat.create({
            jenis_surat: name,
            template_file: req.file.filename
        });
        res.redirect('/admin/template/add?success=true');
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.render('admin/template_form', {
                template: null,
                error: 'Nama template sudah digunakan!',
                success: null
            });
        }
        res.status(500).send('Gagal menyimpan template');
    }
};

exports.deleteSurat = async (req, res) => {
    try {
        const { id } = req.params;
        const surat = await Surat.findByPk(id);
        // Optional: Hapus file dari storage
        // const fs = require('fs');
        // const path = require('path');
        // if (surat && surat.template_file) {
        //     fs.unlinkSync(path.join(__dirname, '../uploads', surat.template_file));
        // }
        await Surat.destroy({ where: { surat_id: id } });
        res.redirect('/admin/template');
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal menghapus template');
    }
};

exports.showEditFormSurat = async (req, res) => {
    try {
        const template = await Surat.findByPk(req.params.id);
        if (!template) return res.sendStatus(404);
        res.render('admin/template_form', {
            template,
            error: null,
            success: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengambil data template untuk diedit');
    }
};

exports.updateSurat = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updateData = { jenis_surat: name };
        if (req.file) {
            updateData.template_file = req.file.filename;
            // Optional: hapus file lama
        }
        await Surat.update(updateData, { where: { surat_id: id } });
        res.redirect('/admin/template');
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal memperbarui template');
    }
};
