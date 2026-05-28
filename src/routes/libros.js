const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Rutas públicas para usuarios autenticados
router.get('/disponibles', verifyToken, librosController.getLibrosDisponibles);
router.get('/', verifyToken, librosController.getLibros);
router.get('/reporte', verifyToken, checkRole([1]), librosController.reporteInventario);
router.get('/:id', verifyToken, librosController.getLibroById);

// Rutas protegidas (Solo Bibliotecaria: id_rol = 1)
router.post('/', verifyToken, checkRole([1]), librosController.createLibro);
router.put('/:id', verifyToken, checkRole([1]), librosController.updateLibro);
router.delete('/:id', verifyToken, checkRole([1]), librosController.deleteLibro);

module.exports = router;
