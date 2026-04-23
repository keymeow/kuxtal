const express = require('express');
const router = express.Router();
const especialistaController = require('../controllers/especialistaController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/especialistas?especialidad=Nutrición
router.get('/', authMiddleware, especialistaController.getEspecialistas);

// GET /api/especialistas/:id
router.get('/:id', authMiddleware, especialistaController.getEspecialistaById);

module.exports = router;
