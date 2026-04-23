const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getDisponibilidad, agendarCita, getMisCitas, cancelarCita, ocultarCita } = require('../controllers/appointmentController');

router.get('/disponibilidad', authMiddleware, getDisponibilidad);
router.post('/agendar', authMiddleware, agendarCita);

router.get('/mis-citas', authMiddleware, getMisCitas);
router.put('/:id/cancelar', authMiddleware, cancelarCita);
router.put('/:id/ocultar', authMiddleware, ocultarCita);

module.exports = router;