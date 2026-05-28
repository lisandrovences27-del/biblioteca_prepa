const express = require('express');
const router = express.Router();
const sancionesController = require('../controllers/sancionesController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Alumno: ver sus propias sanciones
router.get('/mis-sanciones', verifyToken, checkRole([3]), sancionesController.getMisSanciones);

// Admin: gestión de sanciones (Bibliotecaria = 1, Encargada = 2)
router.get('/', verifyToken, checkRole([1, 2]), sancionesController.getSanciones);
router.get('/activas', verifyToken, checkRole([1, 2]), sancionesController.getSancionesActivas);
router.post('/', verifyToken, checkRole([1, 2]), sancionesController.createSancion);
router.put('/:id/resolver', verifyToken, checkRole([1, 2]), sancionesController.resolverSancion);

module.exports = router;
