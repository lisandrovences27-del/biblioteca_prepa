const pool = require('../../config/db');

// Crear una sanción (Bibliotecaria)
exports.createSancion = async (req, res) => {
    try {
        const { id_alumno, id_prestamo, motivo } = req.body;
        const id_bibliotecaria = req.user.id_usuario;

        if (!id_alumno || !motivo) {
            return res.status(400).json({ error: 'El id del alumno y el motivo son obligatorios' });
        }

        // Verificar que el alumno exista y sea alumno
        const [alumno] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ? AND id_rol = 3', [id_alumno]);
        if (alumno.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const [result] = await pool.query(
            'INSERT INTO sanciones (id_alumno, id_prestamo, motivo, estado, id_bibliotecaria) VALUES (?, ?, ?, ?, ?)',
            [id_alumno, id_prestamo || null, motivo, 'Activa', id_bibliotecaria]
        );

        res.status(201).json({ message: 'Sanción aplicada', id_sancion: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sanción' });
    }
};

// Obtener todas las sanciones (Admin)
exports.getSanciones = async (req, res) => {
    try {
        const [sanciones] = await pool.query(`
            SELECT s.*, u.nombre_completo AS alumno, u.numero_control,
                   b.nombre_completo AS aplicada_por
            FROM sanciones s
            JOIN usuarios u ON s.id_alumno = u.id_usuario
            LEFT JOIN usuarios b ON s.id_bibliotecaria = b.id_usuario
            ORDER BY s.fecha_sancion DESC
        `);
        res.json(sanciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener sanciones' });
    }
};

// Obtener sanciones activas (Admin — para dashboard)
exports.getSancionesActivas = async (req, res) => {
    try {
        const [sanciones] = await pool.query(`
            SELECT s.*, u.nombre_completo AS alumno, u.numero_control,
                   b.nombre_completo AS aplicada_por
            FROM sanciones s
            JOIN usuarios u ON s.id_alumno = u.id_usuario
            LEFT JOIN usuarios b ON s.id_bibliotecaria = b.id_usuario
            WHERE s.estado = 'Activa'
            ORDER BY s.fecha_sancion DESC
        `);
        res.json(sanciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener sanciones activas' });
    }
};

// Obtener mis sanciones (Alumno)
exports.getMisSanciones = async (req, res) => {
    try {
        const [sanciones] = await pool.query(`
            SELECT s.id_sancion, s.motivo, s.estado, s.fecha_sancion, s.fecha_resolucion,
                   b.nombre_completo AS aplicada_por
            FROM sanciones s
            LEFT JOIN usuarios b ON s.id_bibliotecaria = b.id_usuario
            WHERE s.id_alumno = ?
            ORDER BY s.fecha_sancion DESC
        `, [req.user.id_usuario]);
        res.json(sanciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tus sanciones' });
    }
};

// Marcar sanción como resuelta (Admin)
exports.resolverSancion = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'UPDATE sanciones SET estado = ?, fecha_resolucion = CURRENT_TIMESTAMP WHERE id_sancion = ?',
            ['Resuelta', id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Sanción no encontrada' });
        res.json({ message: 'Sanción marcada como resuelta' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al resolver la sanción' });
    }
};
