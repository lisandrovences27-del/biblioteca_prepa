const pool = require('../../config/db');

// Solicitar préstamo (Alumno)
exports.solicitarPrestamo = async (req, res) => {
    try {
        const { id_material } = req.body;
        const id_alumno = req.user.id_usuario;

        // Verificar si el alumno está bloqueado
        const [alumno] = await pool.query('SELECT bloqueado FROM usuarios WHERE id_usuario = ?', [id_alumno]);
        if (alumno.length > 0 && alumno[0].bloqueado) {
            return res.status(403).json({ error: 'Tu cuenta está bloqueada. No puedes solicitar préstamos.' });
        }

        // Verificar que el material exista y tenga stock
        const [material] = await pool.query('SELECT * FROM materiales WHERE id_material = ?', [id_material]);
        if (material.length === 0) {
            return res.status(404).json({ error: 'Material no encontrado' });
        }
        if (material[0].stock_disponible <= 0) {
            return res.status(400).json({ error: 'No hay stock disponible para este material' });
        }

        // Verificar si el alumno ya tiene un préstamo pendiente o activo del mismo material
        const [existente] = await pool.query(
            'SELECT * FROM prestamos WHERE id_alumno = ? AND id_material = ? AND estado IN ("Pendiente", "Activo")',
            [id_alumno, id_material]
        );

        if (existente.length > 0) {
            return res.status(400).json({ error: 'Ya tienes una solicitud o préstamo activo para este material' });
        }

        // Determinar tipo de préstamo según la categoría del material
        const tipo_prestamo = material[0].id_categoria === 1 ? 'Libro' : 'Material';

        const [result] = await pool.query(
            'INSERT INTO prestamos (id_alumno, id_material, tipo_prestamo, estado) VALUES (?, ?, ?, ?)',
            [id_alumno, id_material, tipo_prestamo, 'Pendiente']
        );

        res.status(201).json({ message: 'Solicitud de préstamo enviada', id_prestamo: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al solicitar el préstamo' });
    }
};

// Aprobar o rechazar préstamo (Bibliotecaria o Encargada)
exports.procesarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const { accion, dias_prestamo } = req.body; // accion: 'Aprobar' o 'Rechazar'
        const id_encargado = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        const [prestamo] = await pool.query(
            `SELECT p.*, m.id_categoria FROM prestamos p
             JOIN materiales m ON p.id_material = m.id_material
             WHERE p.id_prestamo = ? AND p.estado = 'Pendiente'`, [id]
        );
        if (prestamo.length === 0) return res.status(404).json({ error: 'Préstamo no encontrado o no está pendiente' });

        // Verificar permisos: Bibliotecaria (1) solo libros (cat 1), Encargada (2) solo materiales (cat != 1)
        if (id_rol === 1 && prestamo[0].id_categoria !== 1) {
            return res.status(403).json({ error: 'La Bibliotecaria solo puede gestionar préstamos de libros' });
        }
        if (id_rol === 2 && prestamo[0].id_categoria === 1) {
            return res.status(403).json({ error: 'La Encargada de Equipo solo puede gestionar préstamos de materiales' });
        }

        if (accion === 'Aprobar') {
            const fecha_esperada = new Date();
            fecha_esperada.setDate(fecha_esperada.getDate() + (dias_prestamo || 3)); // Por defecto 3 días

            await pool.query(
                `UPDATE prestamos SET estado = 'Activo', fecha_entrega = CURRENT_TIMESTAMP,
                 fecha_devolucion_esperada = ?, id_encargado_aprobacion = ? WHERE id_prestamo = ?`,
                [fecha_esperada, id_encargado, id]
            );

            // Reducir stock
            await pool.query('UPDATE materiales SET stock_disponible = stock_disponible - 1 WHERE id_material = ?', [prestamo[0].id_material]);

            res.json({ message: 'Préstamo aprobado' });
        } else if (accion === 'Rechazar') {
            await pool.query(
                `UPDATE prestamos SET estado = 'Rechazado', id_encargado_aprobacion = ? WHERE id_prestamo = ?`,
                [id_encargado, id]
            );
            res.json({ message: 'Préstamo rechazado' });
        } else {
            res.status(400).json({ error: 'Acción no válida. Usa "Aprobar" o "Rechazar"' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar el préstamo' });
    }
};

// Registrar devolución (Bibliotecaria o Encargada)
exports.registrarDevolucion = async (req, res) => {
    try {
        const { id } = req.params;
        const id_rol = req.user.id_rol;

        const [prestamo] = await pool.query(
            `SELECT p.*, m.id_categoria FROM prestamos p
             JOIN materiales m ON p.id_material = m.id_material
             WHERE p.id_prestamo = ? AND p.estado = 'Activo'`, [id]
        );
        if (prestamo.length === 0) return res.status(404).json({ error: 'Préstamo no encontrado o no está activo' });

        // Verificar permisos por tipo
        if (id_rol === 1 && prestamo[0].id_categoria !== 1) {
            return res.status(403).json({ error: 'La Bibliotecaria solo puede gestionar devoluciones de libros' });
        }
        if (id_rol === 2 && prestamo[0].id_categoria === 1) {
            return res.status(403).json({ error: 'La Encargada solo puede gestionar devoluciones de materiales' });
        }

        await pool.query(
            `UPDATE prestamos SET estado = 'Devuelto', fecha_devolucion_real = CURRENT_TIMESTAMP WHERE id_prestamo = ?`,
            [id]
        );

        // Aumentar stock
        await pool.query('UPDATE materiales SET stock_disponible = stock_disponible + 1 WHERE id_material = ?', [prestamo[0].id_material]);

        res.json({ message: 'Devolución registrada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la devolución' });
    }
};

// Obtener mis préstamos (Alumno)
exports.misPrestamos = async (req, res) => {
    try {
        const [prestamos] = await pool.query(
            `SELECT p.*, m.nombre AS material, m.imagen, c.nombre AS categoria
             FROM prestamos p
             JOIN materiales m ON p.id_material = m.id_material
             JOIN categorias_material c ON m.id_categoria = c.id_categoria
             WHERE p.id_alumno = ?
             ORDER BY p.fecha_solicitud DESC`,
            [req.user.id_usuario]
        );
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos' });
    }
};

// Obtener todos los préstamos (Admin) — filtrado por tipo según el rol
exports.getTodosPrestamos = async (req, res) => {
    try {
        const id_rol = req.user.id_rol;
        let query = `
            SELECT p.*, u.nombre_completo AS alumno, u.numero_control,
                   m.nombre AS material, c.nombre AS categoria
            FROM prestamos p 
            JOIN usuarios u ON p.id_alumno = u.id_usuario 
            JOIN materiales m ON p.id_material = m.id_material
            JOIN categorias_material c ON m.id_categoria = c.id_categoria
        `;

        // Filtrar por tipo según el rol del admin
        if (id_rol === 1) {
            query += ` WHERE p.tipo_prestamo = 'Libro'`;
        } else if (id_rol === 2) {
            query += ` WHERE p.tipo_prestamo = 'Material'`;
        }

        query += ` ORDER BY p.fecha_solicitud DESC`;

        const [prestamos] = await pool.query(query);
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos' });
    }
};

// Obtener préstamos pendientes (Admin) — para el dashboard
exports.getPrestamosPendientes = async (req, res) => {
    try {
        const id_rol = req.user.id_rol;
        let query = `
            SELECT p.*, u.nombre_completo AS alumno, u.numero_control,
                   m.nombre AS material, c.nombre AS categoria
            FROM prestamos p
            JOIN usuarios u ON p.id_alumno = u.id_usuario
            JOIN materiales m ON p.id_material = m.id_material
            JOIN categorias_material c ON m.id_categoria = c.id_categoria
            WHERE p.estado = 'Pendiente'
        `;

        if (id_rol === 1) {
            query += ` AND p.tipo_prestamo = 'Libro'`;
        } else if (id_rol === 2) {
            query += ` AND p.tipo_prestamo = 'Material'`;
        }

        query += ` ORDER BY p.fecha_solicitud ASC`;

        const [prestamos] = await pool.query(query);
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los préstamos pendientes' });
    }
};

// Obtener historial de préstamos con filtros de fecha (Admin)
exports.getHistorialPrestamos = async (req, res) => {
    try {
        const id_rol = req.user.id_rol;
        const { fecha_inicio, fecha_fin, estado } = req.query;

        let query = `
            SELECT p.*, u.nombre_completo AS alumno, u.numero_control,
                   m.nombre AS material, c.nombre AS categoria
            FROM prestamos p
            JOIN usuarios u ON p.id_alumno = u.id_usuario
            JOIN materiales m ON p.id_material = m.id_material
            JOIN categorias_material c ON m.id_categoria = c.id_categoria
            WHERE 1=1
        `;
        const params = [];

        // Filtrar por tipo según rol
        if (id_rol === 1) {
            query += ` AND p.tipo_prestamo = 'Libro'`;
        } else if (id_rol === 2) {
            query += ` AND p.tipo_prestamo = 'Material'`;
        }

        if (fecha_inicio) {
            query += ` AND p.fecha_solicitud >= ?`;
            params.push(fecha_inicio);
        }
        if (fecha_fin) {
            query += ` AND p.fecha_solicitud <= ?`;
            params.push(fecha_fin + ' 23:59:59');
        }
        if (estado) {
            query += ` AND p.estado = ?`;
            params.push(estado);
        }

        query += ` ORDER BY p.fecha_solicitud DESC`;

        const [prestamos] = await pool.query(query, params);
        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial de préstamos' });
    }
};
