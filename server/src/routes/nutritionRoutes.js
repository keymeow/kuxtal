const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/nutrition/cuestionario → Guardar respuestas
router.post('/cuestionario', authMiddleware, nutritionController.saveCuestionario);

module.exports = router;
