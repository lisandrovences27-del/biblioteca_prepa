const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Obtener la tabla del reporte mensual (mixto: auto/manual)
router.get('/tabla', verifyToken, checkRole([1, 2]), reportesController.getTablaMensual);

// Obtener tabla dinamica de biblioteca
router.get('/dinamico', verifyToken, checkRole([1, 2]), reportesController.getReporteDinamicoBiblioteca);

// Guardar reporte manual
router.post('/tabla', verifyToken, checkRole([1, 2]), reportesController.saveTablaMensual);

module.exports = router;
