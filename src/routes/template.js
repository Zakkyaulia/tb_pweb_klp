const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', templateController.getTemplates);

router.get('/view/:id', templateController.viewTemplateFile);

router.get('/detail/:id', templateController.getTemplateDetail);

module.exports = { router };