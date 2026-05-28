const jwt = require('jsonwebtoken');

// Middleware para verificar que el usuario esté logueado
exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    const token = authHeader.split(' ')[1]; // Formato: Bearer <token>
    
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token mal formado.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // { id_usuario, id_rol, rol_nombre, ... }
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
};

// Middleware para restringir por rol (ej. checkRole([1, 2]) para permitir Bibliotecaria y Encargada)
exports.checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Acceso denegado. Se requiere autenticación.' });
        }

        if (!rolesPermitidos.includes(req.user.id_rol)) {
            return res.status(403).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
        }

        next();
    };
};
