const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const transporter = require('../../config/mailer');


// Registro de Alumnos
exports.registerAlumno = async (req, res) => {
    try {
        const {
            nombre_completo,
            genero,
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
            `INSERT INTO usuarios (nombre_completo, genero, numero_control, curp, correo_electronico, contrasena, id_rol, grado, grupo, turno, especialidad, telefono)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre_completo, genero || null, numero_control, curp || null, correo_electronico, hashedPassword, 3, grado || null, grupo || null, turno || null, especialidad || null, telefono || null]
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
        const { correo_electronico, contrasena, tipoUsuario, numero_control } = req.body;

        const [users] = await pool.query(
            'SELECT u.*, r.nombre as rol_nombre FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.correo_electronico = ?',
            [correo_electronico]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Validar tipo de usuario (Admin vs Alumno)
        if (tipoUsuario === 'admin' && user.id_rol === 3) {
            return res.status(403).json({ error: 'Acceso denegado. Tu cuenta no es de administrador.' });
        }

        if (tipoUsuario === 'alumno') {
            if (user.id_rol !== 3) {
                return res.status(403).json({ error: 'Acceso denegado. Ingresa desde el panel de Administrador.' });
            }
            if (user.numero_control !== numero_control) {
                return res.status(400).json({ error: 'El número de control no coincide con tu cuenta.' });
            }
        }

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

// Cambiar contraseña
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [req.user.id_usuario]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = users[0];

        let validPassword = false;
        if (user.contrasena.startsWith('$2b$') || user.contrasena.startsWith('$2a$')) {
            validPassword = await bcrypt.compare(currentPassword, user.contrasena);
        } else {
            validPassword = (currentPassword === user.contrasena);
        }

        if (!validPassword) {
            return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query(
            'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?',
            [hashedPassword, req.user.id_usuario]
        );

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

// Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
    try {
        const { correo_electronico } = req.body;

        const [users] = await pool.query(
            'SELECT id_usuario, correo_electronico, nombre_completo FROM usuarios WHERE correo_electronico = ?',
            [correo_electronico]
        );

        console.log("Buscando el correo:", correo_electronico);
        console.log("Usuarios encontrados:", users.length);

        if (users.length === 0) {
            // No revelamos si el correo existe o no por seguridad, devolvems exito
            return res.json({ message: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.' });
        }

        const user = users[0];

        // Crear token temporal que expira en 15 minutos
        const resetToken = jwt.sign(
            { id_usuario: user.id_usuario },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generar enlace dinámico según desde dónde se hizo la petición (localhost o render)
        const frontendURL = req.headers.origin || 'https://biblioteca-cetis120.onrender.com';
        const resetLink = `${frontendURL}/reset-password?token=${resetToken}`;

        // Si no hay API key configurada, mostramos el enlace en consola para poder probar
        if (!process.env.BREVO_API_KEY) {
            console.log('\n=============================================');
            console.log('FALTA CONFIGURAR EL CORREO EN .env (BREVO_API_KEY)');
            console.log('Enlace de recuperación (Modo Prueba):');
            console.log(resetLink);
            console.log('=============================================\n');
            return res.json({ message: 'Modo prueba activo: Revisa la consola del servidor para obtener el enlace de recuperación.' });
        }

        console.log("Intentando enviar correo a:", user.correo_electronico, "vía API de Brevo");
        
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Biblioteca CETIS 120', email: 'soportecetis120.2026@gmail.com' },
                to: [{ email: user.correo_electronico }],
                subject: 'Recuperación de Contraseña - Biblioteca',
                htmlContent: `
                    <h3>Hola ${user.nombre_completo},</h3>
                    <p>Has solicitado restablecer tu contraseña en el Sistema de Biblioteca.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva contraseña. <b>Este enlace expirará en 15 minutos.</b></p>
                    <a href="${resetLink}">Restablecer mi contraseña</a>
                    <p>Si no solicitaste este cambio, ignora este correo.</p>
                `
            })
        });

        if (!brevoResponse.ok) {
            const errData = await brevoResponse.json();
            console.error("Error de Brevo:", errData);
            throw new Error('Fallo al enviar el correo mediante la API de Brevo');
        }

        console.log("¡Correo enviado exitosamente a través de Brevo!");
        
        res.json({ message: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación.' });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud de recuperación' });
    }
};

// Restablecer contraseña con token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Faltan datos (token o nueva contraseña)' });
        }

        // Verificar token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ error: 'El enlace de recuperación es inválido o ha expirado.' });
        }

        const id_usuario = decoded.id_usuario;

        // Hashear nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar contraseña en base de datos
        const [result] = await pool.query(
            'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?',
            [hashedPassword, id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.' });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
};
