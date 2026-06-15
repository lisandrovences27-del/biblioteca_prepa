const pool = require('../../config/db');

// Obtener todos los libros (con info de inventario)
exports.getLibros = async (req, res) => {
    try {
        const [libros] = await pool.query(
            `SELECT id_libro AS id_material, nombre,
                    stock_total, stock_disponible,
                    (stock_total - stock_disponible) AS prestados, imagen, codigo_interno,
                    autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria
             FROM libros
             ORDER BY nombre ASC`
        );
        res.json(libros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
};

// Obtener solo libros disponibles (para alumnos — stock > 0)
exports.getLibrosDisponibles = async (req, res) => {
    try {
        const [libros] = await pool.query(
            `SELECT id_libro AS id_material, nombre, stock_disponible, imagen,
                    autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria
             FROM libros
             WHERE stock_disponible > 0
             ORDER BY nombre ASC`
        );
        res.json(libros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros disponibles' });
    }
};

// Obtener libro por ID
exports.getLibroById = async (req, res) => {
    try {
        const { id } = req.params;
        const [libros] = await pool.query('SELECT *, id_libro AS id_material FROM libros WHERE id_libro = ?', [id]);
        if (libros.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(libros[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
};

// Crear libro (Solo Bibliotecaria)
exports.createLibro = async (req, res) => {
    try {
        const { 
            nombre, stock_total, codigo_interno, imagen,
            autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria
        } = req.body;

        if (!nombre || stock_total === undefined) {
            return res.status(400).json({ error: 'Nombre y stock total son obligatorios' });
        }

        const [result] = await pool.query(
            `INSERT INTO libros 
            (nombre, stock_total, stock_disponible, imagen, codigo_interno, autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre, stock_total, stock_total, imagen || null, codigo_interno || null,
                autor || null, editorial || null, edicion || null, paginas || null, anio_publicacion || null, lugar_impresion || null, isbn || null, subcategoria || null
            ]
        );
        res.status(201).json({ message: 'Libro creado', id_material: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
};

// Actualizar libro (Solo Bibliotecaria)
exports.updateLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombre, stock_total, stock_disponible, codigo_interno, imagen,
            autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria
        } = req.body;
        
        const [result] = await pool.query(
            `UPDATE libros SET 
                nombre=?, stock_total=?, stock_disponible=?, codigo_interno=?, imagen=?,
                autor=?, editorial=?, edicion=?, paginas=?, anio_publicacion=?, lugar_impresion=?, isbn=?, subcategoria=?
             WHERE id_libro=?`,
            [
                nombre, stock_total, stock_disponible, codigo_interno, imagen,
                autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria,
                id
            ]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado o no modificado' });
        res.json({ message: 'Libro actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el libro' });
    }
};

// Eliminar libro (Solo Bibliotecaria)
exports.deleteLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM libros WHERE id_libro=?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
};

// Reporte de inventario de libros (mejorado)
exports.reporteInventario = async (req, res) => {
    try {
        // Inventario general
        const [inventario] = await pool.query(
            `SELECT nombre, stock_total, stock_disponible,
                    (stock_total - stock_disponible) AS prestados, codigo_interno
             FROM libros
             ORDER BY nombre ASC`
        );

        // Préstamos activos de libros
        const [prestamosActivos] = await pool.query(
            `SELECT p.id_prestamo, u.nombre_completo AS alumno, u.numero_control,
                    l.nombre AS libro, p.fecha_entrega, p.fecha_devolucion_esperada
             FROM prestamos p
             JOIN usuarios u ON p.id_alumno = u.id_usuario
             JOIN libros l ON p.id_libro = l.id_libro
             WHERE p.tipo_prestamo = 'Libro' AND p.estado = 'Activo'
             ORDER BY p.fecha_devolucion_esperada ASC`
        );

        // Préstamos vencidos
        const [prestamosVencidos] = await pool.query(
            `SELECT p.id_prestamo, u.nombre_completo AS alumno, u.numero_control,
                    l.nombre AS libro, p.fecha_entrega, p.fecha_devolucion_esperada
             FROM prestamos p
             JOIN usuarios u ON p.id_alumno = u.id_usuario
             JOIN libros l ON p.id_libro = l.id_libro
             WHERE p.tipo_prestamo = 'Libro' AND p.estado = 'Activo'
               AND p.fecha_devolucion_esperada < CURDATE()
             ORDER BY p.fecha_devolucion_esperada ASC`
        );

        // Resumen
        const [resumen] = await pool.query(
            `SELECT
                COUNT(*) AS total_libros,
                SUM(stock_total) AS total_ejemplares,
                SUM(stock_disponible) AS total_disponibles,
                SUM(stock_total - stock_disponible) AS total_prestados
             FROM libros`
        );

        res.json({
            resumen: resumen[0],
            inventario,
            prestamos_activos: prestamosActivos,
            prestamos_vencidos: prestamosVencidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el reporte de inventario' });
    }
};
