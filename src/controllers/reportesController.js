const pool = require('../../config/db');

// Generar reporte semanal
exports.generarReporteSemanal = async (req, res) => {
    try {
        const generado_por = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        const fecha_fin = new Date();
        const fecha_inicio = new Date();
        fecha_inicio.setDate(fecha_inicio.getDate() - 7);

        const datos = await _generarDatosReporte(fecha_inicio, fecha_fin, id_rol);

        const [result] = await pool.query(
            `INSERT INTO reportes (tipo, fecha_inicio, fecha_fin, generado_por, datos)
             VALUES (?, ?, ?, ?, ?)`,
            ['Semanal', fecha_inicio.toISOString().split('T')[0], fecha_fin.toISOString().split('T')[0], generado_por, JSON.stringify(datos)]
        );

        res.status(201).json({
            message: 'Reporte semanal generado',
            id_reporte: result.insertId,
            reporte: {
                tipo: 'Semanal',
                fecha_inicio: fecha_inicio.toISOString().split('T')[0],
                fecha_fin: fecha_fin.toISOString().split('T')[0],
                datos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte semanal' });
    }
};

// Generar reporte mensual
exports.generarReporteMensual = async (req, res) => {
    try {
        const generado_por = req.user.id_usuario;
        const id_rol = req.user.id_rol;

        const fecha_fin = new Date();
        const fecha_inicio = new Date();
        fecha_inicio.setMonth(fecha_inicio.getMonth() - 1);

        const datos = await _generarDatosReporte(fecha_inicio, fecha_fin, id_rol);

        const [result] = await pool.query(
            `INSERT INTO reportes (tipo, fecha_inicio, fecha_fin, generado_por, datos)
             VALUES (?, ?, ?, ?, ?)`,
            ['Mensual', fecha_inicio.toISOString().split('T')[0], fecha_fin.toISOString().split('T')[0], generado_por, JSON.stringify(datos)]
        );

        res.status(201).json({
            message: 'Reporte mensual generado',
            id_reporte: result.insertId,
            reporte: {
                tipo: 'Mensual',
                fecha_inicio: fecha_inicio.toISOString().split('T')[0],
                fecha_fin: fecha_fin.toISOString().split('T')[0],
                datos
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte mensual' });
    }
};

// Obtener lista de reportes generados
exports.getReportes = async (req, res) => {
    try {
        const [reportes] = await pool.query(`
            SELECT r.id_reporte, r.tipo, r.fecha_inicio, r.fecha_fin,
                   r.fecha_generacion, u.nombre_completo AS generado_por
            FROM reportes r
            JOIN usuarios u ON r.generado_por = u.id_usuario
            ORDER BY r.fecha_generacion DESC
        `);
        res.json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los reportes' });
    }
};

// Obtener reporte por ID con datos completos
exports.getReporteById = async (req, res) => {
    try {
        const { id } = req.params;
        const [reportes] = await pool.query(`
            SELECT r.*, u.nombre_completo AS generado_por
            FROM reportes r
            JOIN usuarios u ON r.generado_por = u.id_usuario
            WHERE r.id_reporte = ?
        `, [id]);

        if (reportes.length === 0) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }

        const reporte = reportes[0];
        // Parsear datos JSON si es string
        if (typeof reporte.datos === 'string') {
            reporte.datos = JSON.parse(reporte.datos);
        }

        res.json(reporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte' });
    }
};

// ============================================================
// Función interna para generar los datos del reporte
// ============================================================
async function _generarDatosReporte(fechaInicio, fechaFin, id_rol) {
    const fi = fechaInicio.toISOString().split('T')[0];
    const ff = fechaFin.toISOString().split('T')[0] + ' 23:59:59';

    // Determinar filtro de tipo según el rol
    let tipoFiltro = '';
    let tipoParam = [];
    if (id_rol === 1) {
        tipoFiltro = `AND p.tipo_prestamo = 'Libro'`;
    } else if (id_rol === 2) {
        tipoFiltro = `AND p.tipo_prestamo = 'Material'`;
    }

    // Total de préstamos en el período
    const [totalPrestamos] = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamos p WHERE p.fecha_solicitud BETWEEN ? AND ? ${tipoFiltro}`,
        [fi, ff]
    );

    // Préstamos por estado
    const [porEstado] = await pool.query(
        `SELECT p.estado, COUNT(*) AS total FROM prestamos p
         WHERE p.fecha_solicitud BETWEEN ? AND ? ${tipoFiltro}
         GROUP BY p.estado`,
        [fi, ff]
    );

    // Total de devoluciones en el período
    const [totalDevoluciones] = await pool.query(
        `SELECT COUNT(*) AS total FROM prestamos p
         WHERE p.fecha_devolucion_real BETWEEN ? AND ? AND p.estado = 'Devuelto' ${tipoFiltro}`,
        [fi, ff]
    );

    // Materiales/Libros más prestados
    const [masPrestados] = await pool.query(
        `SELECT m.nombre, COUNT(*) AS veces_prestado
         FROM prestamos p
         JOIN materiales m ON p.id_material = m.id_material
         WHERE p.fecha_solicitud BETWEEN ? AND ? ${tipoFiltro}
         GROUP BY m.id_material, m.nombre
         ORDER BY veces_prestado DESC
         LIMIT 10`,
        [fi, ff]
    );

    // Alumnos con más préstamos
    const [alumnosMasPrestamos] = await pool.query(
        `SELECT u.nombre_completo, u.numero_control, COUNT(*) AS total_prestamos
         FROM prestamos p
         JOIN usuarios u ON p.id_alumno = u.id_usuario
         WHERE p.fecha_solicitud BETWEEN ? AND ? ${tipoFiltro}
         GROUP BY u.id_usuario, u.nombre_completo, u.numero_control
         ORDER BY total_prestamos DESC
         LIMIT 10`,
        [fi, ff]
    );

    // Sanciones aplicadas en el período (solo para Bibliotecaria)
    let sancionesData = null;
    if (id_rol === 1) {
        const [sanciones] = await pool.query(
            `SELECT COUNT(*) AS total_sanciones,
                    SUM(CASE WHEN estado = 'Activa' THEN 1 ELSE 0 END) AS activas,
                    SUM(CASE WHEN estado = 'Resuelta' THEN 1 ELSE 0 END) AS resueltas
             FROM sanciones WHERE fecha_sancion BETWEEN ? AND ?`,
            [fi, ff]
        );
        sancionesData = sanciones[0];
    }

    // Estado actual del inventario
    let inventarioQuery = 'SELECT COUNT(*) AS total_items, SUM(stock_total) AS total_stock, SUM(stock_disponible) AS stock_disponible FROM materiales';
    if (id_rol === 1) {
        inventarioQuery += ' WHERE id_categoria = 1';
    } else if (id_rol === 2) {
        inventarioQuery += ' WHERE id_categoria != 1';
    }
    const [inventario] = await pool.query(inventarioQuery);

    return {
        total_prestamos: totalPrestamos[0].total,
        prestamos_por_estado: porEstado,
        total_devoluciones: totalDevoluciones[0].total,
        mas_prestados: masPrestados,
        alumnos_mas_prestamos: alumnosMasPrestamos,
        sanciones: sancionesData,
        inventario: inventario[0]
    };
}
