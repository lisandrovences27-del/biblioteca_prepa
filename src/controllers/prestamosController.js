const pool = require('../../config/db');

exports.solicitarPrestamo = async (req, res) => {
    try {
        const { id_item, tipo_prestamo } = req.body; // Cambiado a id_item y tipo_prestamo
        const id_alumno = req.user.id_usuario;

        if (!tipo_prestamo || !['Libro', 'Material'].includes(tipo_prestamo)) {
            return res.status(400).json({ error: 'Debes especificar el tipo_prestamo ("Libro" o "Material")' });
        }

        // Verificar si el alumno está bloqueado
        const [alumno] = await pool.query('SELECT bloqueado FROM usuarios WHERE id_usuario = ?', [id_alumno]);
        if (alumno.length > 0 && alumno[0].bloqueado) {
            return res.status(403).json({ error: 'Tu cuenta está bloqueada. No puedes solicitar préstamos.' });
        }

        // Verificar que el material exista y tenga stock
        let item;
        if (tipo_prestamo === 'Libro') {
            const [libros] = await pool.query('SELECT * FROM libros WHERE id_libro = ?', [id_item]);
            if (libros.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
            item = libros[0];
        } else {
            const [materiales] = await pool.query('SELECT * FROM materiales WHERE id_material = ?', [id_item]);
            if (materiales.length === 0) return res.status(404).json({ error: 'Material no encontrado' });
            item = materiales[0];
        }

        if (item.stock_disponible <= 0) {
            return res.status(400).json({ error: 'No hay stock disponible para este item' });
        }

        // Verificar si el alumno ya tiene un préstamo pendiente o activo del mismo item
        let existenteQuery = 'SELECT * FROM prestamos WHERE id_alumno = ? AND estado IN ("Pendiente", "Activo") AND ';
        existenteQuery += tipo_prestamo === 'Libro' ? 'id_libro = ?' : 'id_material = ?';
        
        const [existente] = await pool.query(existenteQuery, [id_alumno, id_item]);

        if (existente.length > 0) {
            return res.status(400).json({ error: 'Ya tienes una solicitud o préstamo activo para este item' });
        }

        const insertQuery = 'INSERT INTO prestamos (id_alumno, ' + (tipo_prestamo === 'Libro' ? 'id_libro' : 'id_material') + ', tipo_prestamo, estado) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(insertQuery, [id_alumno, id_item, tipo_prestamo, 'Pendiente']);

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
            `SELECT p.* FROM prestamos p WHERE p.id_prestamo = ? AND p.estado = 'Pendiente'`, [id]
        );
        if (prestamo.length === 0) return res.status(404).json({ error: 'Préstamo no encontrado o no está pendiente' });

        const tipo_prestamo = prestamo[0].tipo_prestamo;

        // Verificar permisos: Bibliotecaria (1) solo libros, Encargada (2) solo materiales
        if (id_rol === 1 && tipo_prestamo !== 'Libro') {
            return res.status(403).json({ error: 'La Bibliotecaria solo puede gestionar préstamos de libros' });
        }
        if (id_rol === 2 && tipo_prestamo === 'Libro') {
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
            if (tipo_prestamo === 'Libro') {
                await pool.query('UPDATE libros SET stock_disponible = stock_disponible - 1 WHERE id_libro = ?', [prestamo[0].id_libro]);
            } else {
                await pool.query('UPDATE materiales SET stock_disponible = stock_disponible - 1 WHERE id_material = ?', [prestamo[0].id_material]);
            }

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
            `SELECT p.* FROM prestamos p WHERE p.id_prestamo = ? AND p.estado = 'Activo'`, [id]
        );
        if (prestamo.length === 0) return res.status(404).json({ error: 'Préstamo no encontrado o no está activo' });

        const tipo_prestamo = prestamo[0].tipo_prestamo;

        // Verificar permisos por tipo
        if (id_rol === 1 && tipo_prestamo !== 'Libro') {
            return res.status(403).json({ error: 'La Bibliotecaria solo puede gestionar devoluciones de libros' });
        }
        if (id_rol === 2 && tipo_prestamo === 'Libro') {
            return res.status(403).json({ error: 'La Encargada solo puede gestionar devoluciones de materiales' });
        }

        await pool.query(
            `UPDATE prestamos SET estado = 'Devuelto', fecha_devolucion_real = CURRENT_TIMESTAMP WHERE id_prestamo = ?`,
            [id]
        );

        // Aumentar stock
        if (tipo_prestamo === 'Libro') {
            await pool.query('UPDATE libros SET stock_disponible = stock_disponible + 1 WHERE id_libro = ?', [prestamo[0].id_libro]);
        } else {
            await pool.query('UPDATE materiales SET stock_disponible = stock_disponible + 1 WHERE id_material = ?', [prestamo[0].id_material]);
        }

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
            `SELECT p.*, 
                    COALESCE(l.nombre, m.nombre) AS material, 
                    COALESCE(l.imagen, m.imagen) AS imagen,
                    CASE WHEN p.tipo_prestamo = 'Libro' THEN 'Libro' ELSE c.nombre END AS categoria
             FROM prestamos p
             LEFT JOIN libros l ON p.id_libro = l.id_libro
             LEFT JOIN materiales m ON p.id_material = m.id_material
             LEFT JOIN categorias_material c ON m.id_categoria = c.id_categoria
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
                   COALESCE(l.nombre, m.nombre) AS material,
                   CASE WHEN p.tipo_prestamo = 'Libro' THEN 'Libro' ELSE c.nombre END AS categoria
            FROM prestamos p 
            JOIN usuarios u ON p.id_alumno = u.id_usuario 
            LEFT JOIN libros l ON p.id_libro = l.id_libro
            LEFT JOIN materiales m ON p.id_material = m.id_material
            LEFT JOIN categorias_material c ON m.id_categoria = c.id_categoria
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
                   COALESCE(l.nombre, m.nombre) AS material,
                   CASE WHEN p.tipo_prestamo = 'Libro' THEN 'Libro' ELSE c.nombre END AS categoria
            FROM prestamos p
            JOIN usuarios u ON p.id_alumno = u.id_usuario
            LEFT JOIN libros l ON p.id_libro = l.id_libro
            LEFT JOIN materiales m ON p.id_material = m.id_material
            LEFT JOIN categorias_material c ON m.id_categoria = c.id_categoria
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
                   COALESCE(l.nombre, m.nombre) AS material,
                   CASE WHEN p.tipo_prestamo = 'Libro' THEN 'Libro' ELSE c.nombre END AS categoria
            FROM prestamos p
            JOIN usuarios u ON p.id_alumno = u.id_usuario
            LEFT JOIN libros l ON p.id_libro = l.id_libro
            LEFT JOIN materiales m ON p.id_material = m.id_material
            LEFT JOIN categorias_material c ON m.id_categoria = c.id_categoria
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
