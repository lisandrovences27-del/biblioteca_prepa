-- Base de datos para el Sistema de Préstamos de Biblioteca Preparatoria
CREATE DATABASE IF NOT EXISTS biblioteca_prepa;
USE biblioteca_prepa;

-- 1. Tabla de Roles (Perfiles)
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles por defecto
INSERT INTO roles (nombre) VALUES 
('Bibliotecaria'), 
('Encargada de Equipo'), 
('Alumno');

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) UNIQUE, -- Para alumnos, opcional para admin
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Insertar algunos usuarios de prueba (contraseñas deberían estar hasheadas en producción, ej. con password_hash de PHP)
INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, id_rol) VALUES 
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
INSERT INTO categorias_material (nombre, id_rol_encargado) VALUES 
('Libros', 1),          -- Administrado por Bibliotecaria
('Calculadoras', 2),    -- Administrado por Encargada de Equipo
('Laptops', 2),
('Cables y Adaptadores', 2);

-- 4. Tabla de Materiales
CREATE TABLE IF NOT EXISTS materiales (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INT NOT NULL,
    stock_total INT NOT NULL DEFAULT 0,
    stock_disponible INT NOT NULL DEFAULT 0,
    imagen VARCHAR(255),
    codigo_interno VARCHAR(50) UNIQUE, -- Ej. número de serie o código de barras
    FOREIGN KEY (id_categoria) REFERENCES categorias_material(id_categoria) ON DELETE CASCADE
);

-- 5. Tabla de Préstamos
CREATE TABLE IF NOT EXISTS prestamos (
    id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_material INT NOT NULL,
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
