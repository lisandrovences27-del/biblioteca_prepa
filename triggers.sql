DELIMITER //

DROP TRIGGER IF EXISTS trigger_prestamos_stock_update //

CREATE TRIGGER trigger_prestamos_stock_update
AFTER UPDATE ON prestamos
FOR EACH ROW
BEGIN
    -- Cuando se aprueba un prestamo (Pasa de Pendiente a Activo)
    IF NEW.estado = 'Activo' AND OLD.estado = 'Pendiente' THEN
        IF NEW.tipo_prestamo = 'Libro' THEN
            UPDATE libros SET stock_disponible = stock_disponible - 1 WHERE id_libro = NEW.id_libro;
        ELSEIF NEW.tipo_prestamo = 'Material' THEN
            UPDATE materiales SET stock_disponible = stock_disponible - 1 WHERE id_material = NEW.id_material;
        END IF;
    END IF;

    -- Cuando se devuelve un prestamo (Pasa de Activo a Devuelto)
    IF NEW.estado = 'Devuelto' AND OLD.estado = 'Activo' THEN
        IF NEW.tipo_prestamo = 'Libro' THEN
            UPDATE libros SET stock_disponible = stock_disponible + 1 WHERE id_libro = NEW.id_libro;
        ELSEIF NEW.tipo_prestamo = 'Material' THEN
            UPDATE materiales SET stock_disponible = stock_disponible + 1 WHERE id_material = NEW.id_material;
        END IF;
    END IF;
END //

DELIMITER ;
