const pool = require('../../config/db');

// Obtener todos los materiales (No libros, categoría != 1) con nombre de categoría
exports.getMateriales = async (req, res) => {
    try {
        const [materiales] = await pool.query(`
            SELECT m.*, c.nombre as categoria_nombre 
            FROM materiales m 
            JOIN categorias_material c ON m.id_categoria = c.id_categoria 
            WHERE m.id_categoria != 1
            ORDER BY c.nombre ASC, m.nombre ASC
        `);
        res.json(materiales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los materiales' });
    }
};

// Obtener solo materiales disponibles (para alumnos — stock > 0)
exports.getMaterialesDisponibles = async (req, res) => {
    try {
        const [materiales] = await pool.query(`
            SELECT m.id_material, m.nombre, m.especificaciones, m.stock_disponible, 
                   m.imagen, c.nombre as categoria_nombre
            FROM materiales m
            JOIN categorias_material c ON m.id_categoria = c.id_categoria
            WHERE m.id_categoria != 1 AND m.stock_disponible > 0
            ORDER BY c.nombre ASC, m.nombre ASC
        `);
        res.json(materiales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los materiales disponibles' });
    }
};

// Obtener material por ID
exports.getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const [materiales] = await pool.query(
            `SELECT m.*, c.nombre as categoria_nombre
             FROM materiales m
             JOIN categorias_material c ON m.id_categoria = c.id_categoria
             WHERE m.id_material = ? AND m.id_categoria != 1`, [id]
        );
        if (materiales.length === 0) return res.status(404).json({ error: 'Material no encontrado' });
        res.json(materiales[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el material' });
    }
};

// Crear nuevo material (Encargada de Equipo)
exports.createMaterial = async (req, res) => {
    try {
        const { nombre, especificaciones, categoria_nombre, stock_total, codigo_interno, imagen } = req.body;

        if (!nombre || !categoria_nombre || stock_total === undefined) {
            return res.status(400).json({ error: 'Nombre, categoría y stock total son obligatorios' });
        }
        
        let [categoria] = await pool.query('SELECT * FROM categorias_material WHERE LOWER(nombre) = LOWER(?)', [categoria_nombre.trim()]);
        
        let id_categoria;
        if (categoria.length === 0) {
            const [newCat] = await pool.query(
                'INSERT INTO categorias_material (nombre, id_rol_encargado) VALUES (?, 2)',
                [categoria_nombre.trim()]
            );
            id_categoria = newCat.insertId;
        } else {
            if (categoria[0].id_rol_encargado !== 2) {
                return res.status(400).json({ error: 'Esa categoría no pertenece a materiales' });
            }
            id_categoria = categoria[0].id_categoria;
        }

        const [result] = await pool.query(
            'INSERT INTO materiales (nombre, especificaciones, id_categoria, stock_total, stock_disponible, imagen, codigo_interno) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, especificaciones || null, id_categoria, stock_total, stock_total, imagen || null, codigo_interno || null]
        );
        res.status(201).json({ message: 'Material creado', id_material: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el material' });
    }
};

// Actualizar material (Encargada de Equipo)
exports.updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, especificaciones, categoria_nombre, stock_total, stock_disponible, codigo_interno, imagen } = req.body;
        
        let id_categoria;
        if (categoria_nombre) {
            let [categoria] = await pool.query('SELECT * FROM categorias_material WHERE LOWER(nombre) = LOWER(?)', [categoria_nombre.trim()]);
            if (categoria.length === 0) {
                const [newCat] = await pool.query(
                    'INSERT INTO categorias_material (nombre, id_rol_encargado) VALUES (?, 2)',
                    [categoria_nombre.trim()]
                );
                id_categoria = newCat.insertId;
            } else {
                if (categoria[0].id_rol_encargado !== 2) {
                    return res.status(400).json({ error: 'Esa categoría no pertenece a materiales' });
                }
                id_categoria = categoria[0].id_categoria;
            }
        }
        
        const [result] = await pool.query(
            'UPDATE materiales SET nombre=?, especificaciones=?, id_categoria=?, stock_total=?, stock_disponible=?, codigo_interno=?, imagen=? WHERE id_material=? AND id_categoria != 1',
            [nombre, especificaciones, id_categoria, stock_total, stock_disponible, codigo_interno, imagen, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Material no encontrado o no modificado' });
        res.json({ message: 'Material actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el material' });
    }
};

// Eliminar material (Encargada de Equipo)
exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM materiales WHERE id_material=? AND id_categoria != 1', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Material no encontrado' });
        res.json({ message: 'Material eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el material' });
    }
};
