const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Registro de alumnos (público)
router.post('/register', authController.registerAlumno);

// Login (público)
router.post('/login', authController.login);

// Perfil del usuario logueado
router.get('/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

// Gestión de alumnos (Solo Bibliotecaria y Encargada)
router.get('/alumnos', verifyToken, checkRole([1, 2]), authController.getAlumnos);
router.put('/alumnos/:id/bloquear', verifyToken, checkRole([1, 2]), authController.bloquearAlumno);
router.put('/alumnos/:id/desbloquear', verifyToken, checkRole([1, 2]), authController.desbloquearAlumno);

module.exports = router;
