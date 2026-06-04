const xlsx = require('xlsx');
const pool = require('./config/db'); // Ajusta si la ruta a tu pool DB es diferente
const path = require('path');

// Ruta del archivo Excel
const filePath = 'C:\\Users\\lisan\\Downloads\\INVENTARIO 2026-estadia.xlsx';

async function importarExcel() {
    try {
        console.log(`Leyendo archivo Excel desde: ${filePath}`);
        const workbook = xlsx.readFile(filePath);
        const sheetName = 'INV 2026';
        const worksheet = workbook.Sheets[sheetName];
        
        if (!worksheet) {
            console.error(`No se encontró la hoja '${sheetName}'`);
            return;
        }

        // Convertimos a JSON manteniendo las posiciones
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        let categoriaActual = 'General';
        let librosImportados = 0;

        console.log(`Comenzando importación de ${data.length} filas posibles...`);

        // Recorremos las filas desde la fila 5 (índice 4)
        for (let i = 4; i < data.length; i++) {
            const row = data[i];
            
            // Si la fila está vacía, saltar
            if (!row || row.length === 0) continue;

            const colA = (row[0] || '').toString().trim();
            const colB = (row[1] || '').toString().trim();
            const colC = (row[2] || '').toString().trim();

            // Detectar cabecera de subcategoría (ej. SECRETARIADO)
            // Normalmente en este Excel las subcategorías aparecen en la columna B o A sin más datos en C
            if (colB && !colC && colB !== 'TITULO') {
                categoriaActual = colB;
                console.log(`--> Nueva categoría detectada: ${categoriaActual}`);
                continue;
            }
            if (colA && !colB && !colC && colA !== 'TITULO') {
                 categoriaActual = colA;
                 console.log(`--> Nueva categoría detectada: ${categoriaActual}`);
                 continue;
            }

            // Si tiene título y autor (o al menos título), es un libro válido
            const titulo = (row[1] || row[0] || '').toString().trim();
            const autor = (row[2] || row[1] || '').toString().trim();
            
            // Verificación simple de que es un registro válido (tiene título y no es la palabra 'TITULO')
            if (titulo && titulo !== 'TITULO' && titulo.length > 2 && titulo !== categoriaActual) {
                // Mapear columnas según el orden detectado en el Excel
                // B: TITULO, C: AUTOR, D: EDITORIAL, E: EDICION, F: NL(paginas), G: AÑO, H: IMPRESO, I: ISBN, J: NL(stock)
                // Nota: xlsx.utils.sheet_to_json con header:1 devuelve un array [colA, colB, colC...]
                
                let tituloLibro = row[1] || '';
                let autorLibro = row[2] || '';
                let editorial = row[3] || '';
                let edicion = row[4] || '';
                let paginasStr = row[5] || '';
                let anio = row[6] || '';
                let lugarImpreso = row[7] || '';
                let isbn = row[8] || '';
                let stockStr = row[9] || '1'; // Si no hay, asumimos 1

                // Limpiar valores
                let paginas = parseInt(paginasStr.toString().replace(/\D/g, '')) || null;
                let stock_total = parseInt(stockStr.toString().replace(/\D/g, '')) || 1;

                // Insertar en base de datos
                await pool.query(
                    `INSERT INTO materiales 
                    (nombre, especificaciones, id_categoria, stock_total, stock_disponible, autor, editorial, edicion, paginas, anio_publicacion, lugar_impresion, isbn, subcategoria) 
                    VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        tituloLibro, 
                        null, 
                        stock_total, 
                        stock_total, 
                        autorLibro, 
                        editorial, 
                        edicion, 
                        paginas, 
                        anio, 
                        lugarImpreso, 
                        isbn, 
                        categoriaActual
                    ]
                );
                librosImportados++;
                process.stdout.write(`\rLibros importados: ${librosImportados}`);
            }
        }

        console.log(`\n¡Importación completada! Se insertaron ${librosImportados} libros.`);
        process.exit(0);

    } catch (error) {
        console.error("Error durante la importación:", error);
        process.exit(1);
    }
}

importarExcel();
