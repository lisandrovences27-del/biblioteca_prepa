-- Base de datos para el Sistema de Préstamos de Biblioteca Preparatoria
CREATE DATABASE IF NOT EXISTS biblioteca_prepa;
USE biblioteca_prepa;

-- 1. Tabla de Roles (Perfiles)
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles por defecto
INSERT IGNORE INTO roles (nombre) VALUES 
('Bibliotecaria'), 
('Encargada de Equipo'), 
('Alumno');

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    numero_control VARCHAR(20) UNIQUE,        -- Para alumnos
    curp VARCHAR(18) UNIQUE,                  -- Para alumnos
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    grado INT NULL,                           -- Grado escolar del alumno (1, 2, 3...)
    grupo VARCHAR(10) NULL,                   -- Grupo (A, B, C...)
    turno ENUM('Matutino', 'Vespertino') NULL, -- Turno del alumno
    especialidad VARCHAR(100) NULL,           -- Especialidad del alumno
    telefono VARCHAR(15) NULL,                -- Teléfono de contacto
    bloqueado BOOLEAN DEFAULT FALSE,          -- Si el alumno está bloqueado para préstamos
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Insertar usuarios de prueba (contraseñas deberían estar hasheadas en producción)
INSERT IGNORE INTO usuarios (nombre_completo, correo_electronico, contrasena, id_rol) VALUES 
('Ana (Bibliotecaria)', 'ana.biblio@prepa.edu.mx', '123456', 1),
('Maria (Encargada)', 'maria.equipo@prepa.edu.mx', '123456', 2);

-- 3. Tabla de Categorías de Material
CREATE TABLE IF NOT EXISTS categorias_material (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_rol_encargado INT NOT NULL, -- Quién administra esta categoría
    FOREIGN KEY (id_rol_encargado) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Insertar categorías
INSERT IGNORE INTO categorias_material (nombre, id_rol_encargado) VALUES 
('Libros', 1),             -- Administrado por Bibliotecaria
('Calculadoras', 2),       -- Administrado por Encargada de Equipo
('Laptops', 2),
('Cables y Adaptadores', 2),
('Otro', 2);               -- Categoría genérica para la Encargada

-- 4. Tabla de Materiales
CREATE TABLE IF NOT EXISTS materiales (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especificaciones TEXT,
    id_categoria INT NOT NULL,
    stock_total INT NOT NULL DEFAULT 0,
    stock_disponible INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    codigo_interno VARCHAR(50) UNIQUE, -- Ej. número de serie o código de barras
    -- Campos extendidos para libros (basados en inventario Excel)
    autor VARCHAR(150),
    editorial VARCHAR(100),
    edicion VARCHAR(50),
    paginas INT,
    anio_publicacion VARCHAR(10),
    lugar_impresion VARCHAR(100),
    isbn VARCHAR(50),
    subcategoria VARCHAR(100),
    FOREIGN KEY (id_categoria) REFERENCES categorias_material(id_categoria) ON DELETE CASCADE
);

-- 5. Tabla de Préstamos
CREATE TABLE IF NOT EXISTS prestamos (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_material INT NOT NULL,
    tipo_prestamo ENUM('Libro', 'Material') DEFAULT 'Material', -- Tipo para filtrar por perfil
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATETIME NULL,
    fecha_devolucion_esperada DATE NULL,
    fecha_devolucion_real DATETIME NULL,
    estado ENUM('Pendiente', 'Activo', 'Devuelto', 'Rechazado', 'Vencido') DEFAULT 'Pendiente',
    id_encargado_aprobacion INT NULL, -- Quién aprobó el préstamo
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material) ON DELETE CASCADE,
    FOREIGN KEY (id_encargado_aprobacion) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- 6. Tabla de Sanciones
CREATE TABLE IF NOT EXISTS sanciones (
    id_sancion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_prestamo INT,
    motivo TEXT NOT NULL,
    estado ENUM('Activa', 'Resuelta') DEFAULT 'Activa',
    fecha_sancion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion DATETIME NULL,
    id_bibliotecaria INT,
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo) ON DELETE SET NULL,
    FOREIGN KEY (id_bibliotecaria) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- 7. Tabla de Reportes
CREATE TABLE IF NOT EXISTS reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Semanal', 'Mensual') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    generado_por INT NOT NULL,
    datos JSON,                                -- Resumen del reporte en formato JSON
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generado_por) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
