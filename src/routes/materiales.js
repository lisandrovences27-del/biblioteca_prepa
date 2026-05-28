const express = require('express');
const router = express.Router();
const materialesController = require('../controllers/materialesController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Ver catálogo de materiales (Todos los autenticados)
router.get('/disponibles', verifyToken, materialesController.getMaterialesDisponibles);
router.get('/', verifyToken, materialesController.getMateriales);
router.get('/:id', verifyToken, materialesController.getMaterialById);

// Operaciones CRUD protegidas (Solo Encargada de Equipo: id_rol = 2)
router.post('/', verifyToken, checkRole([2]), materialesController.createMaterial);
router.put('/:id', verifyToken, checkRole([2]), materialesController.updateMaterial);
router.delete('/:id', verifyToken, checkRole([2]), materialesController.deleteMaterial);

module.exports = router;
