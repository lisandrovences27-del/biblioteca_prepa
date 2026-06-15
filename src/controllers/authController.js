const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

// Registro de Alumnos
exports.registerAlumno = async (req, res) => {
    try {
        const {
            nombre_completo,
            numero_control,
            curp,
            correo_electronico,
            contrasena,
            grado,
            grupo,
            turno,
            especialidad,
            telefono
        } = req.body;

        // Validar campos obligatorios
        if (!nombre_completo || !numero_control || !correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, número de control, correo y contraseña.' });
        }

        // Validar si el correo, número de control o CURP ya existen
        const [existingUser] = await pool.query(
            'SELECT * FROM usuarios WHERE correo_electronico = ? OR numero_control = ?' + (curp ? ' OR curp = ?' : ''),
            curp ? [correo_electronico, numero_control, curp] : [correo_electronico, numero_control]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo, número de control' + (curp ? ' o CURP' : '') + ' ya están registrados.' });
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // id_rol 3 es para Alumno según database.sql
        const [result] = await pool.query(
            `INSERT INTO usuarios (nombre_completo, numero_control, curp, correo_electronico, contrasena, id_rol, grado, grupo, turno, especialidad, telefono)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre_completo, numero_control, curp || null, correo_electronico, hashedPassword, 3, grado || null, grupo || null, turno || null, especialidad || null, telefono || null]
        );

        res.status(201).json({ message: 'Alumno registrado exitosamente', id_usuario: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el alumno' });
    }
};

// Login general (para todos los perfiles)
exports.login = async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        const [users] = await pool.query(
            'SELECT u.*, r.nombre as rol_nombre FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.correo_electronico = ?',
            [correo_electronico]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Comparar contraseña (soporta hash y texto plano para usuarios de prueba)
        let validPassword = false;
        if (user.contrasena.startsWith('$2b$') || user.contrasena.startsWith('$2a$')) {
            validPassword = await bcrypt.compare(contrasena, user.contrasena);
        } else {
            // Bypass temporal para usuarios insertados directamente en SQL sin hash
            validPassword = (contrasena === user.contrasena);
        }

        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si el alumno está bloqueado
        if (user.bloqueado) {
            return res.status(403).json({ error: 'Tu cuenta está bloqueada. Contacta a un administrador.' });
        }

        // Crear Token
        const token = jwt.sign(
            { id_usuario: user.id_usuario, id_rol: user.id_rol, rol_nombre: user.rol_nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre_completo,
                rol: user.rol_nombre,
                id_rol: user.id_rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
};

// Obtener perfil completo del usuario logueado
exports.getProfile = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT u.id_usuario, u.nombre_completo, u.numero_control, u.curp, u.correo_electronico,
                    u.grado, u.grupo, u.turno, u.especialidad, u.telefono, u.bloqueado,
                    u.fecha_registro, r.nombre as rol_nombre
             FROM usuarios u
             JOIN roles r ON u.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [req.user.id_usuario]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};

// Actualizar perfil del usuario logueado
exports.updateProfile = async (req, res) => {
    try {
        const { nombre_completo, telefono, grado, grupo, turno, especialidad } = req.body;

        const [result] = await pool.query(
            `UPDATE usuarios SET nombre_completo = ?, telefono = ?, grado = ?, grupo = ?, turno = ?, especialidad = ?
             WHERE id_usuario = ?`,
            [nombre_completo, telefono, grado, grupo, turno, especialidad, req.user.id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

// Bloquear alumno (Solo Bibliotecaria o Encargada)
exports.bloquearAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario a bloquear sea un alumno (id_rol = 3)
        const [alumno] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ? AND id_rol = 3', [id]);
        if (alumno.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        await pool.query('UPDATE usuarios SET bloqueado = TRUE WHERE id_usuario = ?', [id]);
        res.json({ message: 'Alumno bloqueado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al bloquear al alumno' });
    }
};

// Desbloquear alumno (Solo Bibliotecaria o Encargada)
exports.desbloquearAlumno = async (req, res) => {
    try {
        const { id } = req.params;

        const [alumno] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ? AND id_rol = 3', [id]);
        if (alumno.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        await pool.query('UPDATE usuarios SET bloqueado = FALSE WHERE id_usuario = ?', [id]);
        res.json({ message: 'Alumno desbloqueado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al desbloquear al alumno' });
    }
};

// Obtener lista de alumnos (Solo Admins)
exports.getAlumnos = async (req, res) => {
    try {
        const [alumnos] = await pool.query(
            `SELECT id_usuario, nombre_completo, numero_control, curp, correo_electronico,
                    grado, grupo, turno, especialidad, telefono, bloqueado, fecha_registro
             FROM usuarios WHERE id_rol = 3
             ORDER BY nombre_completo ASC`
        );
        res.json(alumnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de alumnos' });
    }
};
