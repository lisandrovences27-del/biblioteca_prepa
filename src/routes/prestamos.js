const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamosController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Alumnos (id_rol = 3)
router.post('/solicitar', verifyToken, checkRole([3]), prestamosController.solicitarPrestamo);
router.get('/mis-prestamos', verifyToken, checkRole([3]), prestamosController.misPrestamos);

// Administradores (Bibliotecaria = 1, Encargada = 2)
router.get('/todos', verifyToken, checkRole([1, 2]), prestamosController.getTodosPrestamos);
router.get('/pendientes', verifyToken, checkRole([1, 2]), prestamosController.getPrestamosPendientes);
router.get('/historial', verifyToken, checkRole([1, 2]), prestamosController.getHistorialPrestamos);
router.put('/:id/procesar', verifyToken, checkRole([1, 2]), prestamosController.procesarPrestamo);
router.put('/:id/devolver', verifyToken, checkRole([1, 2]), prestamosController.registrarDevolucion);

module.exports = router;
