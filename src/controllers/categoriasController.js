const pool = require('../../config/db');

// Obtener todas las categorías de material
exports.getCategorias = async (req, res) => {
    try {
        const [categorias] = await pool.query(`
            SELECT c.*, r.nombre AS rol_encargado,
                   (SELECT COUNT(*) FROM materiales m WHERE m.id_categoria = c.id_categoria) AS total_materiales
            FROM categorias_material c
            JOIN roles r ON c.id_rol_encargado = r.id_rol
            ORDER BY c.nombre ASC
        `);
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

// Obtener categoría por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [categorias] = await pool.query(`
            SELECT c.*, r.nombre AS rol_encargado
            FROM categorias_material c
            JOIN roles r ON c.id_rol_encargado = r.id_rol
            WHERE c.id_categoria = ?
        `, [id]);

        if (categorias.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(categorias[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};

// Crear nueva categoría (Encargada de Equipo)
exports.createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
        }

        // Verificar que no exista una categoría con el mismo nombre
        const [existente] = await pool.query('SELECT * FROM categorias_material WHERE nombre = ?', [nombre]);
        if (existente.length > 0) {
            return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
        }

        // id_rol_encargado = 2 (Encargada de Equipo)
        const [result] = await pool.query(
            'INSERT INTO categorias_material (nombre, id_rol_encargado) VALUES (?, 2)',
            [nombre]
        );

        res.status(201).json({ message: 'Categoría creada', id_categoria: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

// Actualizar categoría (Encargada de Equipo)
exports.updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
        }

        // No permitir editar la categoría de Libros (id = 1)
        if (parseInt(id) === 1) {
            return res.status(403).json({ error: 'No se puede editar la categoría de Libros' });
        }

        const [result] = await pool.query(
            'UPDATE categorias_material SET nombre = ? WHERE id_categoria = ? AND id_rol_encargado = 2',
            [nombre, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada o no modificable' });
        }

        res.json({ message: 'Categoría actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// Eliminar categoría (Encargada de Equipo)
exports.deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir eliminar la categoría de Libros (id = 1)
        if (parseInt(id) === 1) {
            return res.status(403).json({ error: 'No se puede eliminar la categoría de Libros' });
        }

        // Verificar que no tenga materiales asociados
        const [materiales] = await pool.query('SELECT COUNT(*) AS total FROM materiales WHERE id_categoria = ?', [id]);
        if (materiales[0].total > 0) {
            return res.status(400).json({
                error: `No se puede eliminar esta categoría porque tiene ${materiales[0].total} material(es) asociado(s). Elimina o mueve los materiales primero.`
            });
        }

        const [result] = await pool.query(
            'DELETE FROM categorias_material WHERE id_categoria = ? AND id_rol_encargado = 2',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada o no eliminable' });
        }

        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};
